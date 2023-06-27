import { z } from "zod";

export const CategoriesSchema = z.object({
    mainCategory: z.string(),
    subCategory: z.string().optional(),
    filter: z.string().optional()
})

export type ICategory = z.infer<typeof CategoriesSchema>