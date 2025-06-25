"use client";
import React, { useEffect, useState } from "react";
import { api } from "../../../trpc/react"; // ←パスはプロジェクト構成に合わせて
import { useRouter } from "next/navigation";

export default function EmailRegisterPage() {
  const [email, setEmail] = useState("");
  const createTempUserMutation = api.auth.createTempUser.useMutation();
  const sendVerificationEmail = api.sendMail.sendVerification.useMutation();
  const router = useRouter();

  useEffect(() => {
    console.log("email", email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * JSのイベントオブジェクトのデフォルトの挙動をキャンセルする
     * フォーム送信のデフォルト挙動とは？
     * 本来 <form> を <button type="submit"> で送信すると…
     * → ブラウザはページをリロードして送信内容を処理しようとします（HTMLの標準動作）

     * ❌ それを防がないとどうなる？
      •	React で SPA（Single Page Application）として動いているのに、
      •	submit 時にページがリロードされて状態が初期化される
      •	入力したメールや処理中のロジックもリセットされてしまう */

    e.preventDefault();
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }
    try {
      // 2. まず、仮ユーザーを作成するAPIを呼び出す
      console.log("Creating user...");
      const { userId } = await createTempUserMutation.mutateAsync({ email });
      console.log("User created with ID:", userId, email);
      
      // 3. 次に、メール送信APIを呼び出す
      await sendVerificationEmail.mutateAsync({ email });
      
      alert("認証メールを送信しました。メールを確認してください。");
      
      // 4. 次のページ（メール認証コード入力ページ）に遷移
      router.push(`/sign-up/verify-email?email=${encodeURIComponent(email)}`);

    } catch (error: any) {
      console.error("エラーが発生しました:", error);
      // エラーメッセージをユーザーに分かりやすく表示
      alert(error.message || "処理中にエラーが発生しました。");
    }
    console.log("handleSubmit");
    
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full px-4 bg-white min-h-screen">
      <div className="w-full max-w-md flex flex-col items-center py-8">
        <h2 className="text-3xl font-bold mb-4 text-left w-full">メール登録</h2>
        <p className="text-base text-gray-700 mb-8 text-left w-full leading-relaxed">
          メールを登録していただくと認証コードが届きます。
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-10 text-lg focus:outline-none focus:ring-2 focus:ring-[#e74c5a]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#e74c5a] text-white font-bold font-serif text-lg py-4 rounded-2xl mt-2 transition-colors duration-200 hover:bg-[#d13b4a]"
            disabled={sendVerificationEmail.isLoading}
          >
            {sendVerificationEmail.isLoading ? "送信中..." : "send Email"}
          </button>
        </form>
      </div>
    </main>
  );
} 