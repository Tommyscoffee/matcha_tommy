// src/server/api/routers/auth.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { verifyEmailByToken, generateUniqueVerificationToken, saveVerificationToken } from "../../auth/emailVerification";
import { createTempUser, createUser } from "../../auth/createUser";
import type { User } from "~/src/types/users";
// [ server/auth/ ]  ← 認証の仕組み・設定・ヘルパー
//         ↑
//         │（importして使う）
//         ↓import { User } from '~/src/types/users';

// [ api/routers/auth.ts ]  ← 認証API（メール認証、パスワードリセット等）

export const authRouter = createTRPCRouter({
  // 仮ユーザー作成API
  createTempUser: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const userId = await createTempUser(input.email);
      return { userId };
    }),
  // メール認証トークン発行API
  createVerificationToken: publicProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      const token = (await generateUniqueVerificationToken()) ?? "";
      await saveVerificationToken(input.userId, token);
      return { token };
    }),

  // メール認証API
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const user = await verifyEmailByToken(input.token);
      return user as User;
    }),

    createUser: publicProcedure
    .input(z.object({ email: z.string().email() , password: z.string().min(8, "Password must be at least 8 characters")}))
    .mutation(async ({ input }) => {
      const userId = await createUser(input.email, input.password);
      return { userId };
    }),
});