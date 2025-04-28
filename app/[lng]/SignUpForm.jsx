"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useT } from "@/app/i18n/client";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useT('common')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onHandleSubmit = async (data) => {
    console.log("Submitting data:", data);
    setIsLoading(true);
    try {
      console.log("Submitting data:", data);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response result:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      toast.success("Account created successfully! Please log in.");
      console.log("Attempting to navigate");
      router.push("/?tab=sign-in")
    } catch (error) {
      console.error("Full sign up error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="mb-2.5">Start your journey</p>
      <form
        className="w-full flex justify-center items-center flex-col"
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="w-full flex justify-between items-center gap-3 ">
          <div className="w-full mb-2.5 flex flex-col gap-1.5">
            <Label htmlFor="firstName">{t('form.name')} </Label>
            <Input
              id="firstName"
              placeholder={t('form.name')}
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">{t('form.first_name_required')}</span>
            )}
          </div>
          <div className="w-full mb-2.5 flex flex-col gap-1.5">
            <Label htmlFor="lastName">{t('form.surname')}</Label>
            <Input
              id="lastName"
              placeholder={t('form.surname')}
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">{t('form.last_name_required')}</span>
            )}
          </div>
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="email">{t('form.email')}</Label>
          <Input
            className={cn(errors.email ? "border-red-500" : "")}
            id="email"
            placeholder={t('form.email')}
            {...register("email", {
              required: { value: true, message: t('form.email_required') },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('form.invalid_email_address'),
              },
            })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="password">{t('form.password')}</Label>
          <Input
            type="password"
            id="password"
            placeholder={t('form.password')}
            className={cn(errors.password ? "border-red-500" : "")}
            {...register("password", {
              required: { value: true, message: t('form.password_required') }
            })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">{t('form.confirmPassword')}</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder={t('form.confirmPassword')}
            className={cn(errors.confirmPassword ? "border-red-500" : "")}
            {...register("confirmPassword", {
              required: { value: true, message: t('form.passwords_do_not_match') },
              validate: value => value === password || "Passwords do not match"
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
          )}
        </div>
        <Button
          type="submit"
          variant="gost"
          className="active:bg-sky-400 bg-sky-600 text-white mt-2.5"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </>
  );
}
