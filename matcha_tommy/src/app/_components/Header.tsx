import { FaBell, FaRedo } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm w-full">
    {/* 左側のスペース（同じ幅でバランスを取る） */}
    <div className="w-20" />

    {/* 中央のタイトルなどがある場合 */}
    <div className="text-center flex-1">
        <h1 className="text-lg font-bold">Matcha</h1>
        <p className="text-sm text-gray-500">tommy</p>
    </div>

    {/* 右側の通知＆リロード */}
    <div className="flex justify-end items-center w-20 space-x-4">
        <button className="text-gray-500 text-2xl px-4">
            <FaBell />
        </button>
        <button className="text-gray-500 text-2xl px-4">
            <FaRedo />
        </button>
    </div>
    </header>
  );
}