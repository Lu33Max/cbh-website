import { createTRPCRouter } from "~/server/api/trpc";
import { sampleRouter } from "./routers/samples";
import { authRouter } from "./routers/user";
import { filterRouter } from "./routers/filter";
import { categoriesRouter } from "./routers/categories";

export const appRouter = createTRPCRouter({
  samples: sampleRouter,
  auth: authRouter,
  filter: filterRouter,
  categories: categoriesRouter
});

export type AppRouter = typeof appRouter;
