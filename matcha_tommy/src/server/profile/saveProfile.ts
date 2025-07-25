import { db } from "../db";

export interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  sexual_preference: string;
  birth_date?: string;
  biography?: string;
  latitude?: number;
  longitude?: number;
  interests?: number[];
  images?: string[];
}

export async function saveProfile(data: ProfileData): Promise<number> {
  // バリデーション
  if (!data.email || !data.first_name || !data.last_name || !data.gender) {
    throw new Error("必須項目が不足しています");
  }
  console.log("receiving userData: ", data);

  // まずユーザーIDを取得
  const users = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [data.email]
  ) as any[];

  if (!users.length) {
    throw new Error("ユーザーが見つかりません");
  }

  const userId = users[0].id;

  // ユーザー情報を更新
  await db.query(
    `UPDATE users SET first_name = ?, last_name = ?, gender = ?, sexual_preference = ?, birth_date = ?, biography = ?, latitude = ?, longitude = ? WHERE email = ?`,
    [
      data.first_name,
      data.last_name,
      data.gender,
      data.sexual_preference,
      data.birth_date || null,
      data.biography || null,
      data.latitude || null,
      data.longitude || null,
      data.email
    ]
  );

  // 既存の興味タグを削除
  await db.query(
    "DELETE FROM users_interest_tags_map WHERE user_id = ?",
    [userId]
  );

  // 興味タグを追加
  if (Array.isArray(data.interests)) {
    for (const tagId of data.interests) {
      await db.query(
        `INSERT INTO users_interest_tags_map (user_id, tag_id) VALUES (?, ?)`,
        [userId, tagId]
      );
    }
  }

  // 既存の画像を削除
  await db.query(
    "DELETE FROM photos WHERE user_id = ?",
    [userId]
  );

  // 画像を追加
  if (Array.isArray(data.images)) {
    for (const img of data.images) {
      await db.query(
        `INSERT INTO photos (user_id, url, is_profile) VALUES (?, ?, ?)`,
        [userId, img, false]
      );
    }
  }

  return userId;
}

export async function getProfile(userId: number) {
  const user = await db.query(
    `SELECT * FROM users WHERE id = ?`,
    [userId]
  ) as any[];
  
  if (!user.length) {
    throw new Error("ユーザーが見つかりません");
  }

  const interests = await db.query(
    `SELECT it.* FROM interest_tags it
     JOIN users_interest_tags_map ut ON it.id = ut.tag_id
     WHERE ut.user_id = ?`,
    [userId]
  );

  const photos = await db.query(
    `SELECT * FROM user_photos WHERE user_id = ?`,
    [userId]
  );

  return {
    ...user[0],
    interests,
    photos
  };
} 