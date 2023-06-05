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

export const GroupFilterSchema = z.object({
  col: z.string(),
  type: z.string(),
  values: z.array(z.string()),
  activated: z.boolean(),
  mandatory: z.boolean(),
})

export const GroupSchema: z.ZodSchema<IGroup> = z.lazy(() =>
  z.object({
    not: z.boolean(),
    link: z.string(),
    activated: z.boolean(),
    mandatory: z.boolean(),
    filter: z.array(GroupFilterSchema),
    groups: z.array(GroupSchema)
  })
)

export const NormalFilterSchema = z.object({
    cbhMasterID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    cbhDonorID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    cbhSampleID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    price: z.object({ 
      min: z.number().optional(), 
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    matrix: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    quantity: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    unit: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    labParameter: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    resultInterpretation: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    resultNumerical: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    resultUnit: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    diagnosis: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    ICDCode: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
})

export type IGroupFilter = z.infer<typeof GroupFilterSchema>
export type INormalFilter = z.infer<typeof NormalFilterSchema>

export const FilterType = {
    normal: "Normal",
    expert: "Expert",
}