import { z } from "zod";
import { SampleSchema } from "./database/samples";

export type ISliderSettings = {
  arrows?: boolean;
  autoplay?: boolean;
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  autoplaySpeed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
};

export const TableSampleSchema = z.object({
  id:                               z.string(),
  CBH_Donor_ID:                     z.string().nullable(),
  CBH_Master_ID:                    z.string().nullable(),
  CBH_Sample_ID:                    z.string().nullable(),
  Price:                            z.number().nullable(),
  Quantity:                         z.number().nullable(),
  Unit:                             z.string().nullable(),
  Matrix:                           z.string().nullable(),
  Storage_Temperature:              z.string().nullable(),
  Freeze_Thaw_Cycles:               z.number().nullable(),
  Sample_Condition:                 z.string().nullable(),
  Infectious_Disease_Test_Result:   z.string().nullable(),
  Gender:                           z.string().nullable(),
  Age:                              z.number().nullable(),
  Ethnicity:                        z.string().nullable(),
  BMI:                              z.number().nullable(),
  Lab_Parameter:                    z.string().array().nullable(),
  Result_Interpretation:            z.string().array().nullable(),
  Result_Raw:                       z.string().array().nullable(),
  Result_Numerical:                 z.number().array().nullable(),
  Result_Unit:                      z.string().array().nullable(),
  Cut_Off_Raw:                      z.string().array().nullable(),
  Cut_Off_Numerical:                z.number().array().nullable(),
  Test_Method:                      z.string().array().nullable(),
  Test_System:                      z.string().array().nullable(),
  Test_System_Manufacturer:         z.string().array().nullable(),
  Result_Obtained_From:             z.string().array().nullable(),
  Diagnosis:                        z.string().array().nullable(),
  Diagnosis_Remarks:                z.string().array().nullable(),
  ICD_Code:                         z.string().array().nullable(),
  Pregnancy_Week:                   z.number().nullable(),
  Pregnancy_Trimester:              z.string().nullable(),
  Medication:                       z.string().array().nullable(),
  Therapy:                          z.string().array().nullable(),
  Histological_Diagnosis:           z.string().array().nullable(),
  Organ:                            z.string().nullable(),
  Disease_Presentation:             z.string().nullable(),
  TNM_Class_T:                      z.string().nullable(),
  TNM_Class_N:                      z.string().nullable(),
  TNM_Class_M:                      z.string().nullable(),
  Tumour_Grade:                     z.string().nullable(),
  Tumour_Stage:                     z.string().nullable(),
  Viable_Cells__per_:               z.string().nullable(),
  Necrotic_Cells__per_:             z.string().nullable(),
  Tumour_Cells__per_:               z.string().nullable(),
  Proliferation_Rate__Ki67_per_:    z.string().nullable(),
  Estrogen_Receptor:                z.string().nullable(),
  Progesteron_Receptor:             z.string().nullable(),
  HER_2_Receptor:                   z.string().nullable(),
  Other_Gene_Mutations:             z.string().array().nullable(),
  Country_of_Collection:            z.string().nullable(),
  Date_of_Collection:               z.date().nullable(),
  Procurement_Type:                 z.string().nullable(),
  Informed_Consent:                 z.string().nullable(),
});

export type ITableSample = z.infer<typeof TableSampleSchema>;

export const OptionalSampleSchema = z.object({
  optional: z.boolean(),
  data: SampleSchema,
});

export type IOptionalSample = z.infer<typeof OptionalSampleSchema>;

export const OptionalTableSampleSchema = z.object({
  optional: z.boolean(),
  data: TableSampleSchema,
});

export type IOptionalTableSample = z.infer<typeof OptionalTableSampleSchema>;
