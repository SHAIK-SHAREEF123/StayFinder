"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/src/schemas/auth/signUpSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await axios.post("/api/auth/signup", data);

      if (res.status === 200) {
        toast.success("Signup successful! Logging you in...");

        // Automatically login after signup
        await signIn("credentials", {
          identifier: data.email,
          password: data.password,
          callbackUrl: "/",
        });
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input {...register("email")} placeholder="example@gmail.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" {...register("password")} placeholder="••••••" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input type="password" {...register("confirmPassword")} placeholder="••••••" />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

             <div>
              <Label>Role</Label>
              <select
                {...register("role")}
                className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select role</option>
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>
            <Button type="submit" className="mt-4 w-full">Sign Up</Button>
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
            Sign Up with Google
          </Button>

          <p className="text-sm text-center mt-4">
            Already have an account? <a href="/auth/sign-in" className="text-blue-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </>
  );
}
