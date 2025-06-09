import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { env } from "~/src/env";
import { appRouter } from "~/src/server/api/root";
import { createTRPCContext } from "~/src/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
// リクエストごとのtrpcコンテキストを作成する関数
//これでヘッダー情報を含むことで、認証情報などをtrpcプロシージャ内で使用できるようにしている。
const createContext = async (req: NextRequest) => {
	return createTRPCContext({
		headers: req.headers,
	});
};

// trpcリクエストを処理するハンドラー関数
const handler = (req: NextRequest) =>
	// この関数は、tRPCリクエストを処理する中心的な役割を果たします。エンドポイント、リクエスト、ルーター、コンテキスト作成関数を指定することで、適切なtRPCプロシージャにリクエストをルーティングします。
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError:
			env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(
							`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
						);
					}
				: undefined,
	});
// GETとPOSTリクエストの両方に対してhandlerをエクスポート
// ClientComponentsからのtRPCリクエスト（GETまたはPOST）が
// このhandlerによって処理される
export { handler as GET, handler as POST };
