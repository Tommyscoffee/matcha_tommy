import type { Adapter } from "next-auth/adapters";
import { db } from "../db";

export function MySQLAdapter(): Adapter {
  return {
    async createUser(data) {
      const result = await db.query(
        "INSERT INTO users (email, username, password_hash, first_name, last_name, gender, sexual_preference, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.email,
          data.email?.split("@")[0] || `user_${Date.now()}`,
          "temp_password",
          "temp_first_name",
          "temp_last_name",
          "other",
          "both",
          false
        ]
      ) as any;
      
      return {
        id: result.insertId.toString(),
        email: data.email,
        emailVerified: null,
        image: null,
        name: null,
      };
    },

    async getUser(id) {
      const users = await db.query("SELECT * FROM users WHERE id = ?", [id]) as any[];
      if (!users.length) return null;
      
      const user = users[0];
      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        image: null,
        name: null,
      };
    },

    async getUserByEmail(email) {
      const users = await db.query("SELECT * FROM users WHERE email = ?", [email]) as any[];
      if (!users.length) return null;
      
      const user = users[0];
      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        image: null,
        name: null,
      };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const accounts = await db.query(
        "SELECT * FROM accounts WHERE provider = ? AND provider_account_id = ?",
        [provider, providerAccountId]
      ) as any[];
      
      if (!accounts.length) return null;
      
      const account = accounts[0];
      const users = await db.query("SELECT * FROM users WHERE id = ?", [account.user_id]) as any[];
      if (!users.length) return null;
      
      const user = users[0];
      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        image: null,
        name: null,
      };
    },

    async updateUser(data) {
      if (!data.id) throw new Error("User ID is required");
      
      await db.query(
        "UPDATE users SET email = ? WHERE id = ?",
        [data.email, data.id]
      );
      
      return {
        id: data.id,
        email: data.email || "",
        emailVerified: null,
        image: null,
        name: null,
      };
    },

    async deleteUser(userId) {
      await db.query("DELETE FROM users WHERE id = ?", [userId]);
    },

    async linkAccount(data) {
      await db.query(
        "INSERT INTO accounts (user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.userId,
          data.type,
          data.provider,
          data.providerAccountId,
          data.refresh_token,
          data.access_token,
          data.expires_at,
          data.token_type,
          data.scope,
          data.id_token,
          data.session_state,
        ]
      );
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await db.query(
        "DELETE FROM accounts WHERE provider = ? AND provider_account_id = ?",
        [provider, providerAccountId]
      );
    },

    async createSession(data) {
      await db.query(
        "INSERT INTO sessions (user_id, session_token, expires) VALUES (?, ?, ?)",
        [data.userId, data.sessionToken, data.expires]
      );
      
      return data;
    },

    async getSessionAndUser(sessionToken) {
      const sessions = await db.query(
        "SELECT * FROM sessions WHERE session_token = ?",
        [sessionToken]
      ) as any[];
      
      if (!sessions.length) return null;
      
      const session = sessions[0];
      const users = await db.query("SELECT * FROM users WHERE id = ?", [session.user_id]) as any[];
      
      if (!users.length) return null;
      
      const user = users[0];
      
      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id.toString(),
          expires: session.expires,
        },
        user: {
          id: user.id.toString(),
          email: user.email,
          emailVerified: null,
          image: null,
          name: null,
        },
      };
    },

    async updateSession(data) {
      await db.query(
        "UPDATE sessions SET expires = ? WHERE session_token = ?",
        [data.expires, data.sessionToken]
      );
      
      return data;
    },

    async deleteSession(sessionToken) {
      await db.query("DELETE FROM sessions WHERE session_token = ?", [sessionToken]);
    },

    async createVerificationToken(data) {
      await db.query(
        "INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, ?)",
        [data.identifier, data.token, data.expires]
      );
      
      return data;
    },

    async useVerificationToken({ identifier, token }) {
      const tokens = await db.query(
        "SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?",
        [identifier, token]
      ) as any[];
      
      if (!tokens.length) return null;
      
      const verificationToken = tokens[0];
      await db.query(
        "DELETE FROM verification_tokens WHERE identifier = ? AND token = ?",
        [identifier, token]
      );
      
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      };
    },
  };
} 