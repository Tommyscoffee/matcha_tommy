"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/src/trpc/react";
import type { InterestTag } from "~/src/types/interest_tags";
import { useProfile } from "~/src/context/ProfileContext";


export default function InterestsPage() {
  const { data: interestTags, isLoading } = api.interest.getAll.useQuery<InterestTag[]>();
  const [userTags, setUserTags] = useState<InterestTag[]>([]); // 新規追加タグ用
  const [selected, setSelected] = useState<number[]>([]); // idで管理
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const profileContext = useProfile(); // ← ここに移動

  // DBタグとユーザー追加タグを分けて表示
  const handleTagClick = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id));
    } else {
      if (selected.length >= 5) {
        setError("最大5つまで選択できます");
        return;
      }
      setSelected([...selected, id]);
      setError("");
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (selected.length >= 5) {
      setError("すでに5つ選択しています");
      return;
    }
    if (
      (interestTags && interestTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) ||
      userTags.some(t => t.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("同じタグが既に存在します");
      return;
    }
    // 新規タグを追加（idは負の一時値）
    const newTagObj: InterestTag = { id: Date.now() * -1, name: trimmed, icon: "✨" };
    setUserTags([...userTags, newTagObj]);
    setSelected([...selected, newTagObj.id]); // 強制的に選択
    setNewTag("");
    setError("");
    // ここでAPI経由で新規タグをDBに保存する処理を追加（他ユーザも選択可能にするため）
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("1つ以上選択してください");
      return;
    }
    if (selected.length > 5) {
      setError("最大5つまで選択できます");
      return;
    }
    
    // ProfileContextに興味を保存
    if (profileContext?.setUser && profileContext?.user) {
      profileContext.setUser({
        ...profileContext.user,
        interests: selected, // 選択した興味のIDを保存
      });
    }
    
    router.push("/profile/image/"); // 次のステップに遷移
  };

  return (
    <div style={{
      background: "#fff",
      maxWidth: 420,
      margin: "40px auto",
      padding: "48px 24px",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      minHeight: 700,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
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
          aria-name="Back"
        >
          &#8592;
        </button>
        <button
          type="button"
          onClick={() => router.push("/profile/skip")}
          style={{
            background: "none",
            border: "none",
            color: "#e74c5a",
            fontWeight: 700,
            fontFamily: "serif",
            fontSize: 18,
            cursor: "pointer"
          }}
        >
          Skip
        </button>
      </div>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, fontFamily: "serif" }}>
        Your interests
      </h2>
      <p style={{ color: "#444", fontSize: 16, marginBottom: 32 }}>
        Select a few of your interests and let everyone know what you're passionate about.
      </p>
      <form onSubmit={handleContinue} style={{ width: "100%" }}>
        {/* DBタグ一覧 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16
        }}>
          {interestTags && interestTags.map((tag) => {
            const isSelected = selected.includes(tag.id);
            const isDisabled = !isSelected && selected.length >= 5;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => !isDisabled && handleTagClick(tag.id)}
                disabled={isDisabled}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "18px 18px",
                  borderRadius: 18,
                  border: isSelected ? "none" : "1.5px solid #eee",
                  background: isSelected ? "#e74c5a" : isDisabled ? "#f5f5f5" : "#fff",
                  color: isSelected ? "#fff" : isDisabled ? "#bbb" : "#222",
                  fontWeight: 700,
                  fontFamily: "serif",
                  fontSize: 20,
                  boxShadow: isSelected ? "0 4px 16px #e74c5a22" : "none",
                  justifyContent: "flex-start",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  transition: "all 0.15s"
                }}
              >
                <span style={{ fontSize: 22 }}>{tag.icon}</span>
                {tag.name}
              </button>
            );
          })}
        </div>
        {/* 新規追加タグは下に別枠で表示 */}
        {userTags.length > 0 && (
          <div style={{
            borderTop: "1px solid #eee",
            margin: "16px 0 16px 0",
            paddingTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16
          }}>
            {userTags.map((tag) => {
              const isSelected = selected.includes(tag.id);
              const isDisabled = !isSelected && selected.length >= 5;
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => !isDisabled && handleTagClick(tag.id)}
                  disabled={isDisabled}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "18px 18px",
                    borderRadius: 18,
                    border: isSelected ? "none" : "1.5px solid #eee",
                    background: isSelected ? "#e74c5a" : isDisabled ? "#f5f5f5" : "#fff",
                    color: isSelected ? "#fff" : isDisabled ? "#bbb" : "#222",
                    fontWeight: 700,
                    fontFamily: "serif",
                    fontSize: 20,
                    boxShadow: isSelected ? "0 4px 16px #e74c5a22" : "none",
                    justifyContent: "flex-start",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontSize: 22 }}>{tag.icon}</span>
                  {tag.name}
                </button>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Add new interest"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #eee",
              fontSize: 16
            }}
            maxLength={20}
            disabled={selected.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={selected.length >= 5}
            style={{
              background: selected.length >= 5 ? "#eee" : "#e74c5a",
              color: selected.length >= 5 ? "#aaa" : "#fff",
              fontWeight: 700,
              fontFamily: "serif",
              fontSize: 16,
              padding: "0 18px",
              border: "none",
              borderRadius: 12,
              cursor: selected.length >= 5 ? "not-allowed" : "pointer"
            }}
          >
            + Add
          </button>
        </div>
        {error && <div style={{ color: "#e74c5a", marginBottom: 16, textAlign: "center" }}>{error}</div>}
        <button
          type="submit"
          disabled={selected.length === 0}
          style={{
            width: "100%",
            background: "#e74c5a",
            color: "#fff",
            fontWeight: 700,
            fontFamily: "serif",
            fontSize: 22,
            padding: "18px 0",
            border: "none",
            borderRadius: 20,
            cursor: selected.length > 0 ? "pointer" : "not-allowed",
            opacity: selected.length > 0 ? 1 : 0.5,
            marginTop: 24
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
