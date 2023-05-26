import { createTRPCRouter } from "~/server/api/trpc";
import { sampleRouter } from "./routers/samples";
import { authRouter } from "./routers/user";
import { filterRouter } from "./routers/filter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  samples: sampleRouter,
  auth: authRouter,
  filter: filterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
