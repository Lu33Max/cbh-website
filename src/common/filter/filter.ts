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
    CBH_Master_ID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    CBH_Donor_ID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    CBH_Sample_ID: z.object({
      value: z.string().optional(),
      mandatory: z.boolean()
    }),
    Price: z.object({ 
      min: z.number().optional(), 
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    Matrix: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    Quantity: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    Unit: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    Lab_Parameter: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    Result_Interpretation: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    Result_Numerical: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      mandatory: z.boolean()
    }),
    Result_Unit: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    Diagnosis: z.object({
      value: z.string().array(),
      mandatory: z.boolean()
    }),
    ICD_Code: z.object({
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