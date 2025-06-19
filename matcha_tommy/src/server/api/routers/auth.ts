// src/server/api/routers/auth.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { verifyEmailByToken, generateUniqueVerificationToken, saveVerificationToken } from "../../auth/emailVerification";

// [ server/auth/ ]  ← 認証の仕組み・設定・ヘルパー
//         ↑
//         │（importして使う）
//         ↓
// [ api/routers/auth.ts ]  ← 認証API（メール認証、パスワードリセット等）

export const authRouter = createTRPCRouter({
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
      await verifyEmailByToken(input.token);
      return { success: true };
    }),
});