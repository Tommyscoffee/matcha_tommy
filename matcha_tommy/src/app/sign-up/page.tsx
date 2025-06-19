"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/sign-up/email");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center w-full px-4 bg-white min-h-screen">
      <div className="w-full max-w-md flex flex-col items-center py-8">
        {/* ロゴ */}
        <div className="mb-8">
          <img src="/icon.png" alt="Logo" className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-lg font-semibold mb-6 text-center">Sign up by e-mail</h2>
        <button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg mb-4 transition"
          onClick={handleContinue}
        >
          Continue with email
        </button>
        <Link href="/login" className="w-full">
          <button className="w-full border border-pink-500 text-pink-500 font-semibold py-3 rounded-lg mb-6 transition hover:bg-pink-50">
            Log in (for member)
          </button>
        </Link>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex justify-center gap-4 w-full mb-2">
          <button className="bg-white border border-gray-200 rounded-full p-3 shadow-sm hover:bg-gray-50">
            <img src="/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </button>
          <button className="bg-white border border-gray-200 rounded-full p-3 shadow-sm hover:bg-gray-50">
            <img src="/google.svg" alt="Google" className="w-6 h-6" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          <Link href="/terms" className="underline">Terms</Link> ・ <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}