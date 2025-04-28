import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName, headerName } from './app/i18n/settings';
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const publicPaths = ["/", "/api/auth/signin", "/api/auth/signup"];

acceptLanguage.languages(languages);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
};

export async function middleware(req) {
  // Пропускаем запросы к статическим ресурсам
  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
    return NextResponse.next();
  }

  // Определяем язык
  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  const pathnameParts = req.nextUrl.pathname.split('/');
  const lngInPath = languages.includes(pathnameParts[1]) ? pathnameParts[1] : null;

  // Создаем заголовки для ответа
  const responseHeaders = new Headers();
  responseHeaders.set(headerName, lngInPath || lng);

  // Перенаправляем, если язык не указан в пути
  if (!lngInPath && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  // Обработка реферера
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next({
      headers: responseHeaders
    });
    
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
    
    return response;
  }

  // Проверка доступа к защищенным путям
  const pathWithoutLang = lngInPath ? req.nextUrl.pathname.substring(lngInPath.length + 1) || '/' : req.nextUrl.pathname;

  // Если это публичный путь, пропускаем
  if (publicPaths.includes(pathWithoutLang)) {
    return NextResponse.next({
      headers: responseHeaders
    });
  }
  // Проверка авторизации
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL(`/${lng}/`, req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Добавляем пользовательский ID в заголовки ответа
    responseHeaders.set('user-id', payload.id);
    
    return NextResponse.next({
      headers: responseHeaders
    });
  } catch (error) {
    return NextResponse.redirect(new URL(`/${lng}/`, req.url));
  }
}