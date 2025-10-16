// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      role: "owner" | "tenant";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id: string;
    role: "owner" | "tenant";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    role: "owner" | "tenant";
  }
}
