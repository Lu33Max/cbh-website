import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

//This router is used to manage all api requests, concerning the creation and fetching of filters.
export const filterRouter = createTRPCRouter({
  create: protectedProcedure
    //A new filter will be created, based on the name, type and filter.
    .input(z.object({ name: z.string(), type: z.string(), filter: z.string(), formatting: z.boolean().optional(), activeColumns: z.string().array().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.filter.create({
        data: {
          name: input.name,             //The name of the filter being displayed when loading a filter
          type: input.type,             //Used to discern, whether the filter belongs to the default or expert search
          filter: input.filter,         //The entire filter, as a String object
          userId: ctx.session.user.id,  //The userId of the current user. Used to save filter presets user based
          formatting: input.formatting ?? null,
          activeColumns: input.activeColumns ?? [],
        },
      });
    }),

  //Gets alls available defaukt or expert filters for the current user 
  getAll: protectedProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.filter.findMany({
        where: {
          userId: ctx.session.user.id,
          type: input.type,
        },
      });
    }),
});
