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
  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1)
    return NextResponse.next();
  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lng)
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng)
    lng = fallbackLng;
  const pathnameParts = req.nextUrl.pathname.split('/');
  const lngInPath = languages.includes(pathnameParts[1]) ? pathnameParts[1] : null;


  const headers = new Headers(req.headers);
  headers.set(headerName, lngInPath || lng);


  if (!lngInPath && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer'));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next({ headers });
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  const pathWithoutLang = lngInPath ? req.nextUrl.pathname.substring(lngInPath.length + 1) : req.nextUrl.pathname;

  if (publicPaths.includes(pathWithoutLang) || publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next({ headers });
  }

  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL(`/${lng}/`, req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const requestHeaders = new Headers(headers);
    requestHeaders.set('user-id', payload.id);
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch (error) {
    return NextResponse.redirect(new URL(`/${lng}/`, req.url));
  }
}