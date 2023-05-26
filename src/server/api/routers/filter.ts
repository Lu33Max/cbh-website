import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const filterRouter = createTRPCRouter({
    getAll: protectedProcedure
        .input( z.object({ type: z.string()}))
        .query(async({ ctx, input }) => {
            return ctx.prisma.filter.findMany({
                where: {
                    userId: ctx.session.user.id,
                    type: input.type,
                }
            })
        }),

    create: protectedProcedure
        .input(z.object({ name: z.string(), type: z.string(), filter: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.filter.create({
                data: {
                    name: input.name,
                    type: input.type,
                    filter: input.filter,
                    userId: ctx.session.user.id,
                }
            })
        }),
})