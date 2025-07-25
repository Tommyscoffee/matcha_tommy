"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "~/src/context/ProfileContext";

export default function UserNamePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();
  const profileContext = useProfile();
  const { user, setUser } = profileContext || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !firstName.trim() || !lastName.trim()) {
      setError("ニックネームとユーザー名を入力してください");
      return;
    }
    
    if (!setUser || !user) {
      setError("プロフィールコンテキストが見つかりません");
      return;
    }
    
    // Contextにデータを保存
    setUser({
      email: user.email || "",
      username: username.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      birth_date: birthday,
      images: user.images || [],
      interests: user.interests || [],
      gender: user.gender || "",
      sexual_preference: user.sexual_preference || "",
      biography: user.biography || "",
      latitude: user.latitude || "",
      longitude: user.longitude || "",
    });
    
    console.log("Saved to context:", { username, firstName, lastName, birthday });
    router.push("/profile/gender");
  };

  return (
    <div style={{
      background: "#fff",
      maxWidth: 350,
      margin: "40px auto",
      padding: "48px 24px",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      minHeight: 400,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24, textAlign: "center" }}>ユーザー名を入力</h2>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Nickname (ユーザーネーム)"
          value={username}
          onChange={e => setUsername(e.target.value)}
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
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 16,
            fontSize: 16
          }}
          onBlur={(e) => {
            e.currentTarget.type = "text";
          }}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 16,
            fontSize: 16
          }}
        />        <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 20,
          color: "#e74c5a"
        }}>📅</span>
        <input
          type="date"
          value={birthday}
          onChange={e => setBirthday(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 12px 12px 40px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 16,
            background: birthday ? "#fff" : "#fde7ea",
            color: birthday ? "#222" : "#e74c5a"
          }}
          max={new Date().toISOString().split("T")[0]}
          min="1900-01-01"
          placeholder="Choose birthday date"
        />
      </div>

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
          次へ
        </button>
        {error && <div style={{ color: "#e74c5a", marginTop: 16, textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
} 