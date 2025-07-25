"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "~/src/context/ProfileContext";

export default function DistancePage() {
  const [distance, setDistance] = useState(25); // default value
  const [showModal, setShowModal] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();
  const profileContext = useProfile();
  const { user, setUser } = profileContext || {};

  const min = 1;
  const max = 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistance(Number(e.target.value));
  };

  const handleNext = () => {
    // 位置情報取得
    if (!navigator.geolocation) {
      setGeoError("位置情報取得に対応していません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPendingCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setShowModal(true);
      },
      (err) => {
        setGeoError("位置情報の取得に失敗しました: " + err.message);
      }
    );
  };

  const handleConfirmLocation = async () => {
    setShowModal(false);
    if (!pendingCoords || !setUser || !user) return;
    
    // Contextに位置情報を保存
    setUser({
      email: user.email || "",
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      birth_date: user.birth_date || "",
      images: user.images || [],
      interests: user.interests || [],
      gender: user.gender || "",
      sexual_preference: user.sexual_preference || "",
      biography: user.biography || "",
      latitude: pendingCoords.lat.toString(),
      longitude: pendingCoords.lng.toString(),
    });
    
    router.push("/profile/confirmation");
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
      <div style={{ textAlign: "center", marginBottom: 32, color: "#222", fontSize: 16, lineHeight: 1.7 }}>
        お探しの相手との距離を<br />設定しましょう<br />いつでも変更できます。
      </div>
      <div style={{ width: "100%", margin: "32px 0 12px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <input
          type="range"
          min={min}
          max={max}
          value={distance}
          onChange={handleChange}
          style={{
            width: "100%",
            accentColor: "#e74c5a",
            height: 4,
            marginBottom: 8
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 600, color: "#e74c5a", marginTop: 8 }}>{distance} km</div>
      </div>
      <div style={{ margin: "48px 0 32px 0", fontSize: 26, fontWeight: 700, fontFamily: "serif", textAlign: "center" }}>
        Search New friends
      </div>
      <button
        type="button"
        onClick={handleNext}
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
          cursor: "pointer",
          marginTop: 24
        }}
      >
        Go To Next
      </button>
      {geoError && <div style={{ color: "#e74c5a", marginTop: 16, textAlign: "center" }}>{geoError}</div>}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 260, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>位置情報の利用確認</div>
            <div style={{ fontSize: 15, marginBottom: 24 }}>
              あなたの現在地（緯度: {pendingCoords?.lat.toFixed(4)}, 経度: {pendingCoords?.lng.toFixed(4)}) をプロフィールに保存します。<br />よろしいですか？
            </div>
            <button
              type="button"
              onClick={handleConfirmLocation}
              style={{
                background: "#e74c5a",
                color: "#fff",
                fontWeight: 700,
                fontFamily: "serif",
                fontSize: 16,
                padding: "10px 24px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              保存して次へ
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                marginLeft: 16,
                background: "#eee",
                color: "#444",
                fontWeight: 700,
                fontFamily: "serif",
                fontSize: 16,
                padding: "10px 24px",
                border: "none",
                borderRadius: 10,
                cursor: "pointer"
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
