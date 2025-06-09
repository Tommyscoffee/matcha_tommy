import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { type AppRouter, createCaller } from "~/src/server/api/root";
import { createTRPCContext } from "~/src/server/api/trpc";
import { createQueryClient } from "./query-client";

// サーバーサイドのtRPCコンテキストを作成し、キャッシュする
const createContext = cache(async () => { // cache関数でラップすることで同一リクエスト内での再計算を防ぎ、効率的なクライアント生成を実現します。
	const heads = new Headers(await headers());
	 // `x-trpc-source`ヘッダーを"rsc"として設定して、リクエストがRSCから来ていることを明示
	heads.set("x-trpc-source", "rsc");//

	return createTRPCContext({
		headers: heads,
	});
});
// Tanstack Queryのクエリクライアントを生成し、キャッシュする
const getQueryClient = cache(createQueryClient);

// trpcの呼び出す関数の作成
const caller = createCaller(createContext);

// trpcとtanstack queryを統合するヘルパー関数。RSC(React Server Component)で使用するためのヘルパー関数で、apiオブジェクトとHydrateコンポーネントを作成する。
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient,
);
