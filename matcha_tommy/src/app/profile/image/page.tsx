"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "~/src/context/ProfileContext";

export default function ProfileImagePage() {
  const [images, setImages] = useState<string[]>([]); // base64 or url
  const [error, setError] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileContext = useProfile();
  const { user, setUser } = profileContext || {};

  const handleUploadClick = () => {
    if (images.length >= 5) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length >= 5) return;
    const file = files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError("ファイルサイズは最大5MBまでです。");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImages((prev) => prev.length < 5 ? [...prev, result.url] : prev);
        setError("");
      } else {
        setError(result.error || "アップロードに失敗しました");
      }
    } catch (error) {
      setError("アップロードに失敗しました");
    }

    e.target.value = ""; // allow re-upload same file
  };

  const handleRemove = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    if (images.length === 0) {
      setError("写真を最低1枚アップロードしてください");
      return;
    }
    if (setUser && user) {
      setUser({
        ...user,
        images,
      });
    }
    router.push("/profile/distance");
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
      alignItems: "center"
    }}>
      <div
        style={{
          width: 200,
          height: 200,
          border: "2px solid #bbb",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px auto",
          background: "#fafafa",
          cursor: images.length >= 5 ? "not-allowed" : "pointer"
        }}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={images.length >= 5}
        />
        <div style={{ fontSize: 64, color: "#bbb", marginBottom: 8 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#222", textAlign: "center" }}>Tap To Upload</div>
      </div>
      <div style={{ fontSize: 13, color: "#444", textAlign: "center", marginBottom: 18 }}>
        写真を最低1つアップロードしてください。<br />最大5つまでです。
      </div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        marginBottom: 32
      }}>
        {images.map((img, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <img
              src={img}
              alt={`uploaded-${idx}`}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px #0001"
              }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "#e74c5a",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 1px 4px #0002"
              }}
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleNext}
        disabled={images.length === 0}
        style={{
          width: "100%",
          background: "#e74c5a",
          color: "#fff",
          fontWeight: 700,
          fontFamily: "serif",
          fontSize: 18,
          padding: "18px 0",
          border: "none",
          borderRadius: 16,
          cursor: images.length === 0 ? "not-allowed" : "pointer",
          opacity: images.length === 0 ? 0.5 : 1,
          marginTop: 24
        }}
      >
        Go To Next
      </button>
      {error && <div style={{ color: "#e74c5a", marginTop: 16, textAlign: "center" }}>{error}</div>}
    </div>
  );
}
