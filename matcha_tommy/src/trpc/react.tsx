"use client";

import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import type { AppRouter } from "../server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
// クエリクライアントを取得または作成する関数。サーバーサイドでは、
const getQueryClient = () => {
	if (typeof window === "undefined") {//この条件文でサーバーサイドだと判断する。
		//サーバーサイド: 各リクエストに対して、新しいクエリクライアントを作成。これにより異なるユーザやリクエスト間でのデータの混在を防ぎます。
		return createQueryClient();
	}
	// ブラウザ: シングルトンパターンを使用して同じクエリクライアントを維持。これにより、アプリケーション全体で一貫したキャッシュ管理が可能になる。
	clientQueryClientSingleton ??= createQueryClient();

	return clientQueryClientSingleton;
};

// tRPCクライアントの作成（AppRouter型を使用して型安全性を確保）
export const api = createTRPCReact<AppRouter>();

// ルーター入力の型推論ヘルパー
export type RouterInputs = inferRouterInputs<AppRouter>;

// ルーター出力の型推論ヘルパー
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// このコンポーネントは、tRPCとTanstack Queryの機能をアプリケーション全体で利用可能にします。
export function TRPCReactProvider(props: { children: React.ReactNode }) {
	// クエリクライアントの取得
	const queryClient = getQueryClient();

	// tRPCクライアントの作成
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				// 開発環境ではログを出力
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				//HTTP経由でtrpcリクエストをバッジ処理し、ストリーミングするための設定
				httpBatchStreamLink({
					transformer: SuperJSON,
					url: `${getBaseUrl()}/api/trpc`,
					headers: () => {
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						return headers;
					},
				}),
			],
		}),
	);
//QueryClientProviderとapi.Providerでラップしたコンポーネントを返す
	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}

// ベースURLを取得する関数（環境に応じて適切なURLを返す）
function getBaseUrl() {
	if (typeof window !== "undefined") return window.location.origin;
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
