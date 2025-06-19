import crypto from "crypto";
import { db } from "../db";

// [ server/auth/ ]  ← 認証の仕組み・設定・ヘルパー
//         ↑
//         │（importして使う）
//         ↓
// [ api/routers/auth.ts ]  ← 認証API（メール認証、パスワードリセット等）

// トークン生成
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ユニークなトークンを生成
export async function generateUniqueVerificationToken() {
  let token;
  let exists = true;
  while (exists) {
    token = generateVerificationToken();
    const rows = await db.query(
      "SELECT * FROM verification_tokens WHERE token = ?",
      [token]
    ) as any[];
    exists = rows.length > 0;
  }
  return token;
} 

// トークン保存（verification_tokensテーブルに保存）
export async function saveVerificationToken(userId: number, token: string, expiresInMinutes = 30) {
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  await db.query(
    "INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
}

// トークン検証＆ユーザー認証状態更新
export async function verifyEmailByToken(token: string) {
  // トークン検索
  const rows = await db.query(
    "SELECT * FROM verification_tokens WHERE token = ? AND expires_at > NOW()",
    [token]
  ) as any[];
  const row = rows[0];
  if (!row || rows.length !== 0) throw new Error("Invalid or expired token");

  // ユーザー認証済みに
  await db.query(
    "UPDATE users SET is_verified = 1 WHERE id = ?",
    [row.user_id]
  );
  
  // トークン削除(論理削除)
  await db.query(
    "UPDATE verification_tokens SET expires_at = NOW() WHERE id = ?",
    [row.id]
  );
  return true;
}

