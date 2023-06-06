/*import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ColumnSchema } from "~/common/database/columns";

export const columnRouter = createTRPCRouter ({

    //Create
    create: publicProcedure
        .input(ColumnSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.columns.create({ data: input })
        }),

    createMany: publicProcedure
        .input(ColumnSchema.array())
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.columns.createMany({ data: input })
        }),

    //Read
    getMany: publicProcedure
        .input(z.object({take: z.number(), skip: z.number()}))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.columns.findMany({
                take: input.take,
                skip: input.skip
            })
        }),

    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.columns.findMany()
        }),

    getAllOfCategory: publicProcedure
        .input(z.object({category: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.columns.findMany({
                where: {
                    category: input.category
                }
            })
        }),

    getAllCategories: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.columns.findMany({
                distinct: ['category']
            })
        }),


    //Update
    update: publicProcedure
    .input(ColumnSchema)
    .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.columns.update({
            where: {
                name: input.name
            },
            data: input
        })
    }),

    updateMany: publicProcedure
    .input(ColumnSchema.array())
    .mutation(async ({ ctx, input }) => {
        return await ctx.prisma.columns.updateMany({
            where: {
                name: {
                    in: input.map(column => column.id)
                }
            },
            data: input
        })
    }),

    //Delete
    delete: publicProcedure
        .input( z.string() )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.columns.delete({
                where: {
                    name: input
                }
            })
        }),

    deleteMany: publicProcedure
        .input( z.string().array() )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.columns.deleteMany({
                where: {
                    name: {
                        in: input
                    }
                }
            })
        }),
})*/