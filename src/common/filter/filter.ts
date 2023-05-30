import { z } from "zod";

export type IGroup = {
    not: boolean,
    link: string,
    activated: boolean,
    mandatory: boolean,
    filter: {
      col: string,
      type: string,
      values: string[],
      activated: boolean,
      mandatory: boolean,
    }[],
    groups: IGroup[],
}

export const GroupSchema: z.ZodSchema<IGroup> = z.lazy(() =>
  z.object({
    not: z.boolean(),
    link: z.string(),
    activated: z.boolean(),
    mandatory: z.boolean(),
    filter: z.array(
      z.object({
        col: z.string(),
        type: z.string(),
        values: z.array(z.string()),
        activated: z.boolean(),
        mandatory: z.boolean(),
      })
    ),
    groups: z.array(GroupSchema)
  })
)

export const NormalFilterSchema = z.object({
    cbhMasterID: z.string().optional(),
    cbhDonorID: z.string().optional(),
    cbhSampleID: z.string().optional(),
    price: z.object({ 
      min: z.number().optional(), 
      max: z.number().optional(),
    }),
    matrix: z.array(z.string()),
    quantity: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    unit: z.array(z.string()),
    labParameter: z.array(z.string()),
    resultInterpretation: z.array(z.string()),
    //resultNumericals
    resultUnit: z.array(z.string()),
    diagnosis: z.array(z.string()),
    ICDCode: z.array(z.string()),
})

export type INormalFilter = z.infer<typeof NormalFilterSchema>

export const FilterType = {
    normal: "Normal",
    expert: "Expert",
}