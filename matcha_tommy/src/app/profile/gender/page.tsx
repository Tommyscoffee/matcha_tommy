"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "~/src/context/ProfileContext";

const genderOptions = [
  { label: "Woman", value: "female" },
  { label: "Man", value: "male" },
  { label: "Choose another", value: "other" },
];

export default function GenderPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const profileContext = useProfile();
  const { user, setUser } = profileContext || {};

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    
    if (!setUser || !user) {
      console.error("プロフィールコンテキストが見つかりません");
      return;
    }
    
    // Contextにデータを保存
    setUser({
      email: user.email || "",
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      birth_date: user.birth_date || "",
      images: user.images || [],
      interests: user.interests || [],
      gender: selected,
      sexual_preference: user.sexual_preference || "",
      biography: user.biography || "",
      latitude: user.latitude || "",
      longitude: user.longitude || "",
    });
    
    console.log("Saved gender to context:", selected);
    router.push("/profile/sexual_preference");
  };

  return (
    <div style={{
      background: "#fff",
      maxWidth: 400,
      margin: "40px auto",
      padding: "48px 24px",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      minHeight: 600,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            border: "1px solid #eee",
            background: "#fff",
            borderRadius: 16,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            cursor: "pointer"
          }}
          aria-label="Back"
        >
          &#8592;
        </button>
      </div>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 36, fontFamily: "serif" }}>
        I am a
      </h2>
      <form onSubmit={handleContinue} style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
          {genderOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              style={{
                width: "100%",
                padding: "20px 24px",
                borderRadius: 20,
                border: selected === opt.value ? "none" : "1.5px solid #eee",
                background: selected === opt.value ? "#e74c5a" : "#fff",
                color: selected === opt.value ? "#fff" : "#222",
                fontWeight: 700,
                fontFamily: "serif",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {opt.label}
              {selected === opt.value ? (
                <span style={{ fontSize: 22, marginLeft: 12 }}>&#10003;</span>
              ) : (
                opt.value === "other" ? <span style={{ fontSize: 22, color: "#bbb" }}>&#8250;</span> : null
              )}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!selected}
          style={{
            width: "100%",
            background: "#e74c5a",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "serif",
            fontSize: 20,
            padding: "18px 0",
            border: "none",
            borderRadius: 20,
            cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.5
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
