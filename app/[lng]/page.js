"use client";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useT } from "@/app/i18n/client";

export default function Home() {
  const { t } = useT("common");
  return (
    <>
      {t("form.title")}
      {/* <Tabs defaultValue="sign-in">
      <TabsList>
        <TabsTrigger value="sign-in">Sign In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <p>Sign in to your account</p>
      </TabsContent>
      <TabsContent value="sign-up">
        <p>Create an account to start</p>
      </TabsContent>
    </Tabs>
     */}
    </>
  );
}
