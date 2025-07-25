import type { DefaultSession, NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/src/server/db";
import { MySQLAdapter } from "./mysql-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const users = await db.query(
					"SELECT * FROM users WHERE email = ?",
					[credentials.email]
				) as any[];

				if (!users.length) {
					return null;
				}

				const user = users[0];
				// ここでパスワード検証を行う（bcrypt.compare等）
				// 簡易的にパスワードが一致するかチェック
				if (user.password_hash === credentials.password) {
					return {
						id: user.id.toString(),
						email: user.email,
						name: user.first_name + " " + user.last_name,
					};
				}

				return null;
			}
		}),
	],
	pages: {
		signIn: "/login",
	},
	adapter: MySQLAdapter(),
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET || "matcha-tommy-secret-key-2024-development-only",
	callbacks: {
		session: ({ session, token }) => ({
			...session,
			user: {
				...session.user,
				id: token.sub,
			},
		}),
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		authorized: async ({ auth, request: {nextUrl} }) => {
			
			if (!auth?.user) {
				return false;
			}
			return true;
		},
	},
} satisfies NextAuthConfig;
