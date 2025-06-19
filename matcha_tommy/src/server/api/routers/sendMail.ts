// src/server/auth/sendMail.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import nodemailer from 'nodemailer';



export async function sendVerificationEmail(to: string, token: string) {
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
    html: `<a href=\"${url}\">メール認証リンク</a>`,
  });
}

export const sendMailRouter = createTRPCRouter({
  sendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      // 本来はここでトークン生成やDB保存も行う
      const dummyToken = "dummy-token-123";
      await sendVerificationEmail(input.email, dummyToken);
      return { success: true };
    }),
});