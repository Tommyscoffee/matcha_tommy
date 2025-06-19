"use client";
import React, { useState } from "react";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 認証コード送信処理をここに実装
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
      <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8, textAlign: "left" }}>メール認証</h2>
      <p style={{ marginBottom: 24, color: "#333", fontSize: 14, textAlign: "left" }}>
        メールに届いた認証コードを下記に入力してください
      </p>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="認証コード"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 32,
            fontSize: 16,
            boxSizing: "border-box"
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
          Continue
        </button>
      </form>
    </div>
  );
}
