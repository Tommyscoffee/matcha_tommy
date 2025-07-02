import { redirect } from "next/navigation";
import { auth } from "../../server/auth";
import React from "react";

const profile = {
  name: "Jessica Parker",
  age: 23,
  job: "Professional model",
  distance: "1 km",
  image: "/demo_pictures/tomcruise_1.jpg" // 仮画像
};

export default async function DiscoverPage() {
  const session = await auth();
  const user = session?.user as unknown as { first_name: string; last_name: string };
  // first_name, last_nameが未設定ならリダイレクト
  if (!user?.first_name || !user?.last_name) {
    redirect("/profile/user_name");
  }

  return (
    <div style={{
      background: "#fafafa",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "32px 0"
    }}>
      {/* Header */}
      <div style={{ width: 350, margin: "0 auto 16px auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button style={{ background: "#fff", border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 24, color: "#e74c5a" }}>&lt;</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 26, fontFamily: "serif" }}>Discover</div>
          <div style={{ fontSize: 14, color: "#888" }}>Chicago, IL</div>
        </div>
        <button style={{ background: "#fff", border: "none", borderRadius: 12, width: 40, height: 40, fontSize: 22, color: "#e74c5a" }}>≡</button>
      </div>
      {/* Profile Card */}
      <div style={{
        width: 350,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        background: "#222",
        margin: "0 auto 32px auto",
        position: "relative"
      }}>
        <img src={profile.image} alt="profile" style={{ width: "100%", height: 400, objectFit: "cover" }} />
        {/* Distance badge */}
        <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", color: "#222", borderRadius: 16, padding: "4px 14px", fontWeight: 600, fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {profile.distance}
        </div>
        {/* Card info */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "24px 20px 20px 20px",
          background: "linear-gradient(0deg, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.0) 100%)"
        }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 24, fontFamily: "serif", marginBottom: 4 }}>{profile.name}, {profile.age}</div>
          <div style={{ color: "#fff", fontSize: 16, opacity: 0.85 }}>{profile.job}</div>
        </div>
      </div>
      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24 }}>
        <button style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 32, color: "#e74c5a" }}>×</button>
        <button style={{ width: 80, height: 80, borderRadius: "50%", background: "#e74c5a", border: "none", boxShadow: "0 4px 16px rgba(231,76,90,0.18)", fontSize: 40, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>&hearts;</button>
        <button style={{ width: 60, height: 60, borderRadius: "50%", background: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 32, color: "#a259e7" }}>★</button>
      </div>
      {/* Bottom Navigation (ダミー) */}
      <div style={{ width: 350, display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 auto", padding: "8px 0 0 0" }}>
        <div style={{ flex: 1, textAlign: "center", color: "#e74c5a", fontSize: 28 }}>▮</div>
        <div style={{ flex: 1, textAlign: "center", color: "#bbb", fontSize: 28 }}>♡</div>
        <div style={{ flex: 1, textAlign: "center", color: "#bbb", fontSize: 28 }}>☰</div>
        <div style={{ flex: 1, textAlign: "center", color: "#bbb", fontSize: 28 }}>☻</div>
      </div>
    </div>
  );
} 