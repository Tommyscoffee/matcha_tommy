// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/src/server/db";
import { type User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = await db.query("select * from users where email = ?", [credentials?.email]);
        const user = users[0];
        if (user && await bcrypt.compare(credentials?.password ?? "", user.password_hash)) {
          return { ...user, id: String(user.id) };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as AdapterUser & User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          ...user,
          emailVerified: null,
        } as AdapterUser & User;
      }
      return token;
    },
  },
};

const authHandler = NextAuth(authOptions);

// ✅ NextAuth v5 (App Router) は .GET, .POST で export
export const GET = authHandler.handlers.GET;
export const POST = authHandler.handlers.POST;