import { Prisma, type Samples } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sampleRouter = createTRPCRouter({

    // Get All or Filtered
    getAll: publicProcedure
        .input(z.object({ pages: z.number().optional(), lines: z.number().optional(), search: z.string().optional(), filter: z.object({cbhMasterID: z.string().optional(), cbhDonorID: z.string().optional(), cbhSampleID: z.string().optional(), price: z.object({min: z.number().optional(), max: z.number().optional() }), matrix: z.array(z.string()), quantity: z.object({min: z.number().optional(), max: z.number().optional() }), unit: z.array(z.string()).optional(), labParameter: z.array(z.string()), resultInterpretation: z.array(z.string()), resultUnit: z.array(z.string()), diagnosis: z.array(z.string()), ICDCode: z.array(z.string()),} ) }))
        .query(({ ctx, input }) => {
            return ctx.prisma.samples.findMany({ 
                take: input.lines, 
                skip: (input.pages && input.lines) ? (input.pages -1) * input.lines : 0,
                where: {
                    AND: [
                    { cbhDonorID: { search: input.search, contains: input.filter.cbhDonorID, mode: 'insensitive' } },
                    { cbhMasterID: { search: input.search, contains: input.filter.cbhMasterID, mode: 'insensitive' } },
                    { cbhSampleID: { search: input.search, contains: input.filter.cbhSampleID, mode: 'insensitive' } },
                    { price: { lte: input.filter.price.max, gte: input.filter.price.min } },
                    { labParameter: { search: input.search, in: input.filter.labParameter?.length > 0 ? input.filter.labParameter : undefined, mode: 'insensitive' } },
                    { diagnosis: { search: input.search, in: input.filter.diagnosis?.length > 0 ? input.filter.diagnosis : undefined, mode: 'insensitive' } },
                    { matrix: { search: input.search, in: input.filter.matrix?.length > 0 ? input.filter.matrix : undefined, mode: 'insensitive' } },
                    { quantity: { lte: input.filter.quantity.max, gte: input.filter.quantity.min } },
                    { ICDCode: { search: input.search, in: input.filter.ICDCode?.length > 0 ? input.filter.ICDCode : undefined, mode: 'insensitive' } },
                    { resultInterpretation: { search: input.search, in: input.filter.resultInterpretation?.length > 0 ? input.filter.resultInterpretation : undefined, mode: 'insensitive' } },
                    { resultUnit: { search: input.search, in: input.filter.resultUnit?.length > 0 ? input.filter.resultUnit : undefined, mode: 'insensitive' } },
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

    test: publicProcedure
        .input(z.object({ obj: z.string().or(z.number()).optional()}))
        .query(({ ctx, input }) => {
            return ctx.prisma.$queryRaw<Samples[]>`SELECT * FROM "Samples" ${
                input.obj ? Prisma.sql`WHERE "cbhDonorID" = ${getValue(input.obj)}` : Prisma.empty
            }`
        }),

    simpleFilter: publicProcedure
        .input(z.object({ filters: z.object({ sampleID: z.array(z.string()), labParameter: z.array(z.string()) })}))
        .query(({ctx, input}) => {
            return "hi"
        }),
})

function getValue(obj: string | number): string {
    return `${obj}`
}