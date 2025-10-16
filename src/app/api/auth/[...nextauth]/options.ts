import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/dbConnect";
import User from "../../../../models/UserModel";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials login (email or username)
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: { identifier: string; password: string } | undefined) : Promise<any> {
        if (!credentials) throw new Error("No credentials provided");
        await connectDB();

        const user = await User.findOne({
          $or: [
            { email: credentials?.identifier },
            { name: credentials?.identifier },
          ],
        });

        if (!user) throw new Error("No user found");
        const isPasswordValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isPasswordValid) throw new Error("Incorrect password");

        return user;
      },
    }),

    // Google OAuth
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],

  callbacks: {
    // JWT callback: include custom fields
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString();
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    // Session callback: include custom fields in session
    async session({ session, token }) {
      if (session.user && token) {
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "owner" | "tenant";
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/sign-in" },
};
