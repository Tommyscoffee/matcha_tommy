"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/src/trpc/react";

// 簡易的な一般的英単語リスト（実際はもっと多くてもOK）
const commonWords = [
  "password", "123456", "qwerty", "letmein", "welcome", "monkey", "abc123", "iloveyou"
];


function isCommonWord(pw: string) {
  return commonWords.some(word => pw.toLowerCase().includes(word));
}

export default function RegisterPage() {
  const searchParams = useSearchParams();
  // verify-emailページからemailをクエリで受け取る想定
  const createUserMutation = api.auth.createUser.useMutation();
  const email = searchParams.get("email") || "xxxxxxxx.com（登録email）";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const isCommon = isCommonWord(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("パスワードが一致しません");
      return;
    }
    if (password.length < 8){
      setError("パスワードは8文字以上入力必要があります")
      return;
    }
    if (isCommon) {
      setError("パスワードに一般的な英単語は使えません");
      return;
    }
    // ここで登録API呼び出し
    try {
      console.log("=== email", email);
      console.log("== password",password);
      await createUserMutation.mutateAsync({ email, password });
    } catch (error: any) {
      setError(error.message || "登録に失敗しました");
    }
  };

  return (
    <div style={{
      background: "#fff",
      maxWidth: 350,
      margin: "40px auto",
      padding: "48px 24px",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      minHeight: 600,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, textAlign: "left" }}>ユーザ登録</h2>
      <p style={{ marginBottom: 24, color: "#333", fontSize: 14, textAlign: "left" }}>
        パスワードを入力してください。
      </p>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          value={email}
          placeholder="xxxxxxxx.com（登録email）"
          disabled
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 16,
            fontSize: 16,
            background: "#fafafa",
            color: "#888"
          }}
        />
        <input
          type="password"
          placeholder="新たなパスワード(8文字以上)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 16,
            fontSize: 16
          }}
        />
        <input
          type="password"
          placeholder="新たなパスワード（確認用）"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 32,
            fontSize: 16
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#e74c5a",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "serif",
            fontSize: 16,
            padding: "14px 0",
            border: "none",
            borderRadius: 12,
            cursor: "pointer"
          }}
        >
          Register
        </button>
        {error && <div style={{ color: "#e74c5a", marginTop: 16, textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
} 