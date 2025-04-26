"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onHandleSubmit = async (data) => {
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
              placeholder="First name"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">First name is required</span>
            )}
          </div>
          <div className="w-full mb-2.5 flex flex-col gap-1.5">
            <Label htmlFor="lastName">Last Name </Label>
            <Input
              id="lastName"
              placeholder="Last name"
              {...register("lastName")}
            />
          </div>
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            className={cn(errors.email ? "border-red-500" : "")}
            id="email"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className={cn(errors.password ? "border-red-500" : "")}
            {...register("password", {
              required: { value: true, message: "Password is required" }
            })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <div className="w-full mb-2.5 flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            className={cn(errors.confirmPassword ? "border-red-500" : "")}
            {...register("confirmPassword", {
              required: { value: true, message: "Please confirm your password" },
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
