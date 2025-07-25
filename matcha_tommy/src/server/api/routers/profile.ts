import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { saveProfile, getProfile, type ProfileData } from "../../profile/saveProfile";

export const profileRouter = createTRPCRouter({
  // プロフィール保存API
  saveProfile: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      username: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      gender: z.string(),
      sexual_preference: z.string(),
      birth_date: z.string().optional(),
      biography: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      interests: z.array(z.number()).optional(),
      images: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log("ctx: ", ctx);
      // protectedProcedureにより、ctx.session.userは確実に存在する
      const userId = await saveProfile(input as ProfileData);
      return { success: true, userId };
    }),

  // プロフィール取得API
  getProfile: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const profile = await getProfile(input.userId);
      return profile;
    }),
});
