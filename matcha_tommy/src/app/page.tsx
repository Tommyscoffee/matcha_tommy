import Link from "next/link";
import { auth } from "../server/auth";
import { HydrateClient, api } from "../trpc/server";
import { LatestPost } from "../app/_components/post";

export default async function Home() {
	//サーバーサイドでtrpcクエリを実行
	const hello = await api.post.hello({ text: "from tRPC" });
	console.log("=== hello ====", hello);
	//セッション情報を取得
	const session = await auth();
	console.log("=== session ====", session);


	if (session?.user) {
		/** prefetch() は、tRPCのヘルパーメソッドです。クライアントサイドで使うuseQuery や useMutationのようなものです。
			prefetch はfetchと違って結果をスローしません。 その代わりに、prefetch はクエリをキャッシュに追加し、それをハイドレートしてクライアントに送信します。
			voidは、この操作の結果を無視することを示しています（prefetchは副作用として扱われます）。 */
		void api.post.getLatest.prefetch();
	}

	return (
		//サーバサイドでフェッチされたデータをクライアントサイドへ渡すためのHydrateClientコンポーネントでラップ
		<HydrateClient>
			<main className="flex min-h-screen flex-col items-center justify-between bg-gray-100 px-4 py-6">
				{/* Discover Header */}
				<div className="text-center mb-4">
					<h2 className="text-lg font-semibold text-gray-700">Discover</h2>
					<p className="text-sm text-gray-500">Chicago, IL</p>
				</div>

				{/* Profile Card */}
				<div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-lg bg-white">
					<img
						src="/demo_pictures/tomcruise_1.jpg"
						alt="Jessica Parker"
						className="w-full h-96 object-cover"
					/>
					<div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
						1 km
					</div>
					<div className="p-4">
						<h3 className="text-lg font-semibold">Jessica Parker, 23</h3>
						<p className="text-sm text-gray-500">Professional model</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-center items-center gap-6 mt-6">
					<button className="bg-white shadow-md w-14 h-14 rounded-full flex items-center justify-center text-red-500 text-2xl">
						&#10005;
					</button>
					<button className="bg-pink-500 shadow-md w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl">
						&#10084;
					</button>
					<button className="bg-white shadow-md w-14 h-14 rounded-full flex items-center justify-center text-purple-500 text-xl">
						&#9733;
					</button>
				</div>


				{session?.user && <LatestPost />}
			</main>
		</HydrateClient>
	);
}