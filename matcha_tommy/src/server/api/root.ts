import { postRouter } from "~/src/server/api/routers/post";
import { sendMailRouter } from "~/src/server/api/routers/sendMail";
import { createCallerFactory, createTRPCRouter } from "~/src/server/api/trpc";
import { authRouter } from "./routers/auth";

// /api/routersディレクトリに定義された個別のルーター（この場合はpostRouter）をまとめる
export const appRouter = createTRPCRouter({
	post: postRouter,
	sendMail: sendMailRouter,
  auth: authRouter,
	// 将来的に新しいSub Routerを追加する場合、ここに追加します
  });
  
  // APIの型定義をエクスポート：クライアント側での型安全性を確保
  export type AppRouter = typeof appRouter;
  
  // サーバーサイドでAPIを直接呼び出すため関数
  export const createCaller = createCallerFactory(appRouter);
  