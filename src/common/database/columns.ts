import { z } from "zod";

export const ColumnSchema = z.object({
    name: z.string(),
    category: z.string().optional()
})

export type IColumn = z.infer<typeof ColumnSchema>