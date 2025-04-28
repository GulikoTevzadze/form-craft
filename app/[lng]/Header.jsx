import Link from "next/link";
import SignOut from "../../components/SignOut";
import ThemeSwitcher from "../../components/ThemeSwicher";
import SignUpForm from "./SignUpForm";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <div>
        <Link href="/"> forms</Link>
        <Link href="/users">Users</Link>
      </div>
      <SignUpForm />

      <div>
        <LanguageSwitcher />
        <ThemeSwitcher />
        <SignOut />
      </div>
    </header>
  );
}
