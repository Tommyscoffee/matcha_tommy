import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/src/server/api/trpc";
import { db } from "~/src/server/db";

// postRouterの定義：投稿に関連する操作をまとめたSub Router
export const postRouter = createTRPCRouter({
	// 認証が不要なProcedure：誰でもアクセス可能
	hello: publicProcedure
	  // 入力スキーマの定義：textという文字列を受け取る
	  .input(z.object({ text: z.string() }))
	  // クエリの実装：入力されたtextを使って挨拶メッセージを返す
	  .query(({ input }) => {
		return {
		  greeting: `Hello ${input.text}`,
		};
	  }),
  
	// 認証が必要なProcedure：認証済みユーザーのみアクセス可能
	create: protectedProcedure
	  // 入力スキーマの定義：nameという1文字以上の文字列を受け取る
	  .input(z.object({ name: z.string().min(1) }))
	  // ミューテーション（データ変更操作）の実装
	  .mutation(async ({ ctx, input }) => {
		// データベースに新しい投稿を作成
		return ctx.db.post.create({
		  data: {
			name: input.name,
			// 現在のユーザーを投稿の作成者として関連付け
			createdBy: { connect: { id: ctx.session.user.id } },
		  },
		});
	  }),
  
	// 認証が必要なProcedure：最新の投稿を取得
	getLatest: protectedProcedure.query(async ({ ctx }) => {
	  // 現在のユーザーが作成した投稿の中で最新のものを取得
	  const post = await ctx.db.post.findFirst({
		orderBy: { createdAt: "desc" },
		where: { createdBy: { id: ctx.session.user.id } },
	  });
  
	  // 投稿が見つかればその投稿を、見つからなければnullを返す
	  return post ?? null;
	}),
  
	// 認証が必要なProcedure：秘密のメッセージを取得（画面には未実装）
	getSecretMessage: protectedProcedure.query(() => {
	  // 認証済みユーザーのみがアクセスできる秘密のメッセージを返す
	  return "you can now see this secret message!";
	}),
	getUser: publicProcedure.query(async ()=> {
        return db.user.findMany();
    }),
    createUser: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string(),
        username: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        gender: z.string(),
        sexualPreference: z.string(),
        biography: z.string(),
    })).mutation(async ({input}) => {
        return db.user.create({
            data: {
                email: input.email,
                password: input.password,
                username: input.username,
                firstName: input.firstName,
                lastName: input.lastName,
                gender: input.gender,
                sexualPreference: input.sexualPreference,
                biography: input.biography,
            }
        })
    })	
});
