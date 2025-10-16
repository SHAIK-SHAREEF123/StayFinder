"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/schemas/auth/loginSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

type SignInFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid credentials");
      } else {
        toast.success("Login successful!");
        window.location.href = "/"; // redirect to home
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white bg-opacity-30 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label>Email or Username</Label>
            <Input
              type="text"
              placeholder="Enter your email or username"
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-4 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <Separator />
          <span className="text-gray-400">OR</span>
          <Separator />
        </div>

        <Button
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full"
        >
          Continue with Google
        </Button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/auth/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
