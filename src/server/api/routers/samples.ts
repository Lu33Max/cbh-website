import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const sampleRouter = createTRPCRouter({

    // Get All or Filtered
    getAll: publicProcedure
        .input(z.object({ pages: z.number(), lines: z.number(), search: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.samples.findMany({ 
                take: input.lines, 
                skip: (input.pages -1) * input.lines,
                where: {
                    cbhDonorID: {
                        contains: input.search,
                    },
                },
            });
        }),

  // Delete
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input}) => {
            return ctx.prisma.samples.delete({
                where: {
                    id: input.id,
                },
            });
        }),
})