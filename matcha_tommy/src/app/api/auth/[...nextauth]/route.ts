import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { AdapterUser } from "next-auth/adapters";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email as string },
        });

        if (user && user.password === credentials?.password) {
          return {
            ...user,
            id: String(user.id)
          };
        }

        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
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
          emailVerified: null
        } as AdapterUser & User;
      }
      return token;
    }
  }
});

export { handler as GET, handler  as POST };