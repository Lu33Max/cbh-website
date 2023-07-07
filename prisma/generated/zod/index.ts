import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AccountOrderByRelevanceFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','token_type','scope','id_token','session_state']);

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state']);

export const CategoriesOrderByRelevanceFieldEnumSchema = z.enum(['id','mainCategory','subCategory','filter']);

export const CategoriesScalarFieldEnumSchema = z.enum(['id','mainCategory','subCategory','filter']);

export const ColumnsOrderByRelevanceFieldEnumSchema = z.enum(['name','category']);

export const ColumnsScalarFieldEnumSchema = z.enum(['name','category']);

export const FilterOrderByRelevanceFieldEnumSchema = z.enum(['id','name','type','filter','userId']);

export const FilterScalarFieldEnumSchema = z.enum(['id','name','type','filter','userId']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SamplesOrderByRelevanceFieldEnumSchema = z.enum(['id','CBH_Donor_ID','CBH_Master_ID','CBH_Sample_ID','Country_of_Collection','Cut_Off_Raw','Diagnosis','Diagnosis_Remarks','Disease_Presentation','Estrogen_Receptor','Ethnicity','Gender','HER_2_Receptor','Histological_Diagnosis','ICD_Code','Infectious_Disease_Test_Result','Informed_Consent','Lab_Parameter','Matrix','Medication','Necrotic_Cells__per_','Organ','Other_Gene_Mutations','Pregnancy_Trimester','Procurement_Type','Progesteron_Receptor','Proliferation_Rate__Ki67_per_','Result_Interpretation','Result_Obtained_From','Result_Raw','Result_Unit','Sample_Condition','Storage_Temperature','TNM_Class_M','TNM_Class_N','TNM_Class_T','Test_System','Test_System_Manufacturer','Therapy','Tumour_Cells__per_','Tumour_Grade','Tumour_Stage','Unit','Viable_Cells__per_','Test_Method']);

export const SamplesScalarFieldEnumSchema = z.enum(['id','Age','BMI','CBH_Donor_ID','CBH_Master_ID','CBH_Sample_ID','Country_of_Collection','Cut_Off_Numerical','Cut_Off_Raw','Date_of_Collection','Diagnosis','Diagnosis_Remarks','Disease_Presentation','Estrogen_Receptor','Ethnicity','Freeze_Thaw_Cycles','Gender','HER_2_Receptor','Histological_Diagnosis','ICD_Code','Infectious_Disease_Test_Result','Informed_Consent','Lab_Parameter','Matrix','Medication','Necrotic_Cells__per_','Organ','Other_Gene_Mutations','Pregnancy_Trimester','Pregnancy_Week','Price','Procurement_Type','Progesteron_Receptor','Proliferation_Rate__Ki67_per_','Quantity','Result_Interpretation','Result_Numerical','Result_Obtained_From','Result_Raw','Result_Unit','Sample_Condition','Storage_Temperature','TNM_Class_M','TNM_Class_N','TNM_Class_T','Test_System','Test_System_Manufacturer','Therapy','Tumour_Cells__per_','Tumour_Grade','Tumour_Stage','Unit','Viable_Cells__per_','Test_Method']);

export const SessionOrderByRelevanceFieldEnumSchema = z.enum(['id','sessionToken','userId']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id','name','email','image','password']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','password']);

export const VerificationTokenOrderByRelevanceFieldEnumSchema = z.enum(['identifier','token']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  password: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// CATEGORIES SCHEMA
/////////////////////////////////////////

export const CategoriesSchema = z.object({
  id: z.string().cuid(),
  mainCategory: z.string(),
  subCategory: z.string().nullable(),
  filter: z.string().nullable(),
})

export type Categories = z.infer<typeof CategoriesSchema>

/////////////////////////////////////////
// COLUMNS SCHEMA
/////////////////////////////////////////

export const ColumnsSchema = z.object({
  name: z.string(),
  category: z.string().nullable(),
})

export type Columns = z.infer<typeof ColumnsSchema>

/////////////////////////////////////////
// SAMPLES SCHEMA
/////////////////////////////////////////

export const SamplesSchema = z.object({
  id: z.string().cuid(),
  Age: z.number().int().nullable(),
  BMI: z.number().int().nullable(),
  CBH_Donor_ID: z.string().nullable(),
  CBH_Master_ID: z.string().nullable(),
  CBH_Sample_ID: z.string().nullable(),
  Country_of_Collection: z.string().nullable(),
  Cut_Off_Numerical: z.number().nullable(),
  Cut_Off_Raw: z.string().nullable(),
  Date_of_Collection: z.coerce.date().nullable(),
  Diagnosis: z.string().nullable(),
  Diagnosis_Remarks: z.string().nullable(),
  Disease_Presentation: z.string().nullable(),
  Estrogen_Receptor: z.string().nullable(),
  Ethnicity: z.string().nullable(),
  Freeze_Thaw_Cycles: z.number().int().nullable(),
  Gender: z.string().nullable(),
  HER_2_Receptor: z.string().nullable(),
  Histological_Diagnosis: z.string().nullable(),
  ICD_Code: z.string().nullable(),
  Infectious_Disease_Test_Result: z.string().nullable(),
  Informed_Consent: z.string().nullable(),
  Lab_Parameter: z.string().nullable(),
  Matrix: z.string().nullable(),
  Medication: z.string().nullable(),
  Necrotic_Cells__per_: z.string().nullable(),
  Organ: z.string().nullable(),
  Other_Gene_Mutations: z.string().nullable(),
  Pregnancy_Trimester: z.string().nullable(),
  Pregnancy_Week: z.number().int().nullable(),
  Price: z.number().int().nullable(),
  Procurement_Type: z.string().nullable(),
  Progesteron_Receptor: z.string().nullable(),
  Proliferation_Rate__Ki67_per_: z.string().nullable(),
  Quantity: z.number().nullable(),
  Result_Interpretation: z.string().nullable(),
  Result_Numerical: z.number().nullable(),
  Result_Obtained_From: z.string().nullable(),
  Result_Raw: z.string().nullable(),
  Result_Unit: z.string().nullable(),
  Sample_Condition: z.string().nullable(),
  Storage_Temperature: z.string().nullable(),
  TNM_Class_M: z.string().nullable(),
  TNM_Class_N: z.string().nullable(),
  TNM_Class_T: z.string().nullable(),
  Test_System: z.string().nullable(),
  Test_System_Manufacturer: z.string().nullable(),
  Therapy: z.string().nullable(),
  Tumour_Cells__per_: z.string().nullable(),
  Tumour_Grade: z.string().nullable(),
  Tumour_Stage: z.string().nullable(),
  Unit: z.string().nullable(),
  Viable_Cells__per_: z.string().nullable(),
  Test_Method: z.string().nullable(),
})

export type Samples = z.infer<typeof SamplesSchema>

/////////////////////////////////////////
// FILTER SCHEMA
/////////////////////////////////////////

export const FilterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  type: z.string(),
  filter: z.string(),
  userId: z.string(),
})

export type Filter = z.infer<typeof FilterSchema>
