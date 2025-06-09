"use client";

import { useState } from "react";

import { api } from "~/src/trpc/react";

export function LatestPost() {
	// 最新の投稿を取得するためのtRPCクエリを実行
	// SuspenseQueryの結果を取得するためのユーティリティ関数を取得
	console.log("=== LatestPosst ====");
	const [latestPost] = api.post.getLatest.useSuspenseQuery();
	console.log("=== LatestPosst ====");
	
	// tRPCのユーティリティ関数を取得
	const utils = api.useUtils();

	// 新しい投稿のタイトルを管理するためのuseState
	const [name, setName] = useState("");

	//新しい投稿を作成するためのtRPCミューテーションを取得
	const createPost = api.post.create.useMutation({
		onSuccess: async () => {
			//投稿作成成功後、投稿リストを再取得
			await utils.post.invalidate();

			//入力フィールドをクリア
			setName("");
		},
	});

	return (
		<div className="w-full max-w-xs">
			{/* 最新の投稿がある場合は表示 なければメッセージを表示*/}
			{latestPost ? (
				<p className="truncate">Your most recent post: {latestPost.name}</p>
			) : (
				<p>You have no posts yet.</p>
			)}

			{/* 新しい投稿を作成するためのフォーム */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					//フォームの送信時、ミューテーションを実行、新しい投稿を作成
					createPost.mutate({ name });
				}}
				className="flex flex-col gap-2"
			>
				{/* 新しい投稿のタイトルを入力するためのテキストフィールド */}
				<input
					type="text"
					placeholder="Title"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
				/>
				{/* ボタンを押すと新しい投稿を作成する */}
				<button
					type="submit"
					className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
					disabled={createPost.isPending}
				>
					{createPost.isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
}
