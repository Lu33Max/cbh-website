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
                    OR: [
                    { cbhDonorID: { search: input.search, mode: 'insensitive' } },
                    { cbhMasterID: { search: input.search, mode: 'insensitive' } },
                    { cbhSampleID: { search: input.search, mode: 'insensitive' } },
                    { labParameter: { search: input.search, mode: 'insensitive' } },
                    { diagnosis: { search: input.search, mode: 'insensitive' } },
                    { matrix: { search: input.search, mode: 'insensitive' } },
                    { ICDCode: { search: input.search, mode: 'insensitive' } },
                    { resultInterpretation: { search: input.search, mode: 'insensitive' } },
                    { resultUnit: { search: input.search, mode: 'insensitive' } },
                    ]
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