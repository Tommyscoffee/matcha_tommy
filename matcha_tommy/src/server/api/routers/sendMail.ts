// src/server/auth/sendMail.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import nodemailer from 'nodemailer';
import { generateUniqueVerificationToken, saveVerificationToken } from "../../../server/auth/emailVerification";
import { db } from "../../db"; // db.queryでユーザーID取得

export async function sendVerificationEmail(to: string) {
  // 1. emailからuserIdを取得
  const users = await db.query("SELECT id FROM users WHERE email = ?", [to]) as { id: number }[];
  console.log("sendVerificationEmail1: users", users);
  // if (!users.length) throw new Error("User not found");
  const userId = users[0]?.id || 0;
  // if (!!userId) throw new Error("User is already registered");

  // 2. トークン生成・保存
  const token = await generateUniqueVerificationToken();
  if (!token) throw new Error("Token generation failed");
  console.log("token", token);
  await saveVerificationToken(userId, token);

  // 3. メール送信
  const transporter = nodemailer.createTransport({
    // 例: Gmail
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const url = `https://your-domain.com/registration/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "メール認証のお知らせ",
    text: `以下のリンクをクリックしてメール認証を完了してください: ${url}`,
    html: `<div>
      <h1>メール認証のお知らせ</h1>
      <p>以下のリンクをクリックしてメール認証を完了してください: ${token}</p>
    </div>`,
  });
}

export const sendMailRouter = createTRPCRouter({
  sendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await sendVerificationEmail(input.email);
      return { success: true };
    }),
});