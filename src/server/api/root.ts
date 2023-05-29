import { createTRPCRouter } from "~/server/api/trpc";
import { sampleRouter } from "./routers/samples";
import { authRouter } from "./routers/user";
import { filterRouter } from "./routers/filter";

export const appRouter = createTRPCRouter({
  samples: sampleRouter,
  auth: authRouter,
  filter: filterRouter,
});

export type AppRouter = typeof appRouter;
