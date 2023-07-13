import { createTRPCRouter } from "~/server/api/trpc";
import { sampleRouter } from "./routers/samples";
import { authRouter } from "./routers/user";
import { filterRouter } from "./routers/filter";
import { categoriesRouter } from "./routers/categories";
import { columnRouter } from "./routers/columns";

//Register new API routers here
export const appRouter = createTRPCRouter({
  samples: sampleRouter,
  auth: authRouter,
  filter: filterRouter,
  categories: categoriesRouter,
  columns: columnRouter,
});

export type AppRouter = typeof appRouter;
