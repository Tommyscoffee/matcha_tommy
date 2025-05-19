import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					name: input.name,
					createdBy: { connect: { id: ctx.session.user.id } },
				},
			});
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.post.findFirst({
			orderBy: { createdAt: "desc" },
			where: { createdBy: { id: ctx.session.user.id } },
		});

		return post ?? null;
	}),

	getSecretMessage: protectedProcedure.query(() => {
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
