"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "~/src/context/ProfileContext";
import { api } from "~/src/trpc/react";
import { useSession } from "next-auth/react";

export default function ConfirmationPage() {
  const router = useRouter();
  const profileContext = useProfile();
  const user = profileContext?.user;
  const saveProfileMutation = api.profile.saveProfile.useMutation();
  const [error, setError] = useState("");
  const [bio, setBio] = useState(user?.biography || "");
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/login");
    }
  }, [status, router]);

  const handleSave = async () => {
    try {
      if (!user) {
        setError("プロフィールデータが見つかりません");
        return;
      }
      
      // biographyをcontextに保存
      if (profileContext?.setUser) {
        console.log("profileContext.setUser");
        profileContext.setUser({
          ...user,
          biography: bio,
        });
      }
      
      // 必須項目のバリデーション
      if (!user.first_name || !user.last_name || !user.gender || !user.sexual_preference) {
        console.log("user: ", user);
        setError("必須項目（名前、性別、性的嗜好）が入力されていません");
        return;
      }
      
      // データ形式を変換（Context → tRPCスキーマ）
      const transformedData = {
        email: user.email || session?.user?.email || "",
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        sexual_preference: user.sexual_preference,
        birth_date: user.birth_date,
        biography: bio,
        latitude: user.latitude ? parseFloat(user.latitude) : undefined,
        longitude: user.longitude ? parseFloat(user.longitude) : undefined,
        interests: user.interests ?? [],
        images: user.images ?? [],
      };
      
      console.log("transformedData: ", transformedData);
      console.log("session status: ", status);
      console.log("session data: ", session);
      console.log("session user: ", session?.user);
      console.log("session user id: ", session?.user?.id);
      console.log("session user email: ", session?.user?.email);
      
      // セッションが存在しない場合はエラー
      if (!session?.user) {
        setError("セッションが見つかりません。ログインしてください。");
        return;
      }
      
      await saveProfileMutation.mutateAsync(transformedData);
      router.push("/profile"); // 保存後にプロフィールページへ
    } catch (e) {
      // エラー処理
      setError("プロフィールの保存に失敗しました");
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
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        textAlign: "center",
        fontFamily: "serif",
        fontWeight: 700,
        fontSize: 22,
        color: "#222",
        margin: "40px 0 20px 0",
        lineHeight: 1.7
      }}>
        Congratration!!<br /><br />
        <span style={{ fontSize: 20 }}>
          You have completed<br />Filling Your Profile<br />
          Please check your profile<br />In Next Page!!
        </span>
      </div>
      {error && (
        <div style={{
          color: "#e74c5a",
          fontSize: 14,
          textAlign: "center",
          marginBottom: 4,
          padding: "8px 16px",
          backgroundColor: "#fdf2f2",
          borderRadius: 4,
          border: "1px solid #fecaca"
        }}>
          {error}
        </div>
      )}
      <div style={{ margin: "0px 0 12px 0", width: "100%" }}>
        <div style={{ fontSize: 13, color: "#222", marginBottom: 6, textAlign: "center" }}>
          FYI:<br />If there's anything you'd like to share,<br />you can write it in 100 characters.
        </div>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value.slice(0, 100))}
          maxLength={100}
          placeholder="Let's grab some coffee..."
          style={{
            width: "100%",
            minHeight: 48,
            borderRadius: 8,
            border: "1px solid #ddd",
            padding: "10px 12px",
            fontSize: 15,
            marginBottom: 8,
            resize: "none",
            boxSizing: "border-box"
          }}
        />
        <div style={{ textAlign: "right", fontSize: 12, color: "#888" }}>{bio.length}/100</div>
      </div>
      <button
        type="button"
        onClick={() => handleSave()}
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
        Check My Profile
      </button>
    </div>
  );
}
