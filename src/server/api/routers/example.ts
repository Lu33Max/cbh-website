import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  //Read
  getAll: publicProcedure
    .input(z.object({ pages: z.number(), lines: z.number(), search: z.string() }))
    .query(({ ctx, input }) => {
    return ctx.prisma.samples.findMany({ 
      take: input.lines, 
      skip: (input.pages -1) * input.lines,
      where: {
        cbhDonorID: {
          search: input.search,
        },
      },
    });
  }),

  //Delete
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input}) => {
      return ctx.prisma.samples.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
