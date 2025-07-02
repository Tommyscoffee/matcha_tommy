import { db } from "../db";
import bcrypt from "bcrypt";

export async function createTempUser(email: string): Promise<number> {
  console.log("createUser1", email);
  // 1. ユーザーが既に存在するかチェック
  const existingUsers = await db.query("SELECT id FROM users WHERE email = ?", [email]) as { id: number }[];
  console.log("createUser1: existingUsers", existingUsers);
  if (existingUsers.length > 0) {
    // 既に仮登録済みの場合は、そのIDを返すか、エラーとする
    // ここではエラーとして処理します
    throw new Error("このメールアドレスは既に使用されています。");
  }
  console.log("createUser2", email);
  // 2. NULL不可カラムのための一時的なデータを用意
  const tempUsername = `user_${Date.now()}`;
  const tempPassword = "password-not-set"; // 本登録時に設定されるべき
  console.log("createUser3", email);
  // 3. 'id'を指定せずにINSERTを実行
  const result = await db.query(
    "INSERT INTO users (email, username, password_hash, first_name, last_name, gender, sexual_preference, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [email, tempUsername, tempPassword, 'temp', 'temp', 'other', 'both', false] // is_verified: falseで仮登録
  ) as any;
  console.log("createUser4", email);

  // 4. 自動採番されたIDを返す
  if (!result || !result.insertId) {
    throw new Error("ユーザーの作成に失敗しました。");
  }
  return result.insertId;
}

export async function createUser(email: string, password: string): Promise<void> {
  console.log("createUser1", email);
  // 1. ユーザーが既に存在するかチェック
  const existingUsers = await db.query("SELECT id FROM users WHERE email = ?", [email]) as { id: number }[];
  console.log("createUser1: existingUsers", existingUsers);
  if (existingUsers.length <= 0) {
    // 既に仮登録済みの場合は、そのIDを返すか、エラーとする
    // ここではエラーとして処理します
    throw new Error("このメールアドレスでの仮登録されたユーザはいません。");
  }
  console.log("createUser2", email);
  // 2. パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("createUser3 email", email);
  console.log("createUser3 bashedPassword", hashedPassword);
  // 3. 仮ユーザのpasswordを更新する
  const result = await db.query(
    "UPDATE users SET password_hash = ? WHERE email = ?",
    [hashedPassword,email]
  ) as any;
  return result

}