import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../../db";

export const interestRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const tags = await db.query("SELECT * FROM interest_tags");
    return tags;
  }),
});