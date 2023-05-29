import { TypeOf, bigint, z } from "zod";
import { useHookstate, type State } from '@hookstate/core';

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

const baseGroupSchema = z.object({
    not: z.boolean(), 
    link: z.string(),   
    activated: z.boolean(),             
    filter: z.object({
        col: z.string(), 
        type: z.string(), 
        values: z.string().array(),
        activated: z.boolean()
    }).array()
})

type Group = z.infer<typeof baseGroupSchema> & {
    groups: Group[];
};

const groupSchema: z.ZodType<Group> = baseGroupSchema.extend({
    groups: z.lazy(() => groupSchema.array()),
});

export const sampleRouter = createTRPCRouter({

    // Create
    createMany: publicProcedure
        .input( z.array(z.object({
            id:                             z.string().optional(),
            CBH_Donor_ID:                   z.string().nullable(),
            CBH_Master_ID:                  z.string().nullable(),
            CBH_Sample_ID:                  z.string().nullable(),
            Price:                          z.number().nullable(),
            Quantity:                       z.number().nullable(),
            Unit:                           z.string().nullable(),
            Matrix:                         z.string().nullable(),
            Storage_Temperature:            z.string().nullable(),
            Freeze_Thaw_Cycles:             z.number().nullable(),
            Sample_Condition:               z.string().nullable(),
            Infectious_Disease_Test_Result: z.string().nullable(),
            Gender:                         z.string().nullable(),
            Age:                            z.number().nullable(),
            Ethnicity:                      z.string().nullable(),
            BMI:                            z.number().nullable(),
            Lab_Parameter:                  z.string().nullable(),
            Result_Interpretation:          z.string().nullable(),
            Result_Raw:                     z.string().nullable(),
            Result_Numerical:               z.number().nullable(),
            Result_Unit:                    z.string().nullable(),
            Cut_Off_Raw:                    z.string().nullable(),
            Cut_Off_Numerical:              z.number().nullable(),
            Test_Method:                    z.string().nullable(),
            Test_System:                    z.string().nullable(),
            Test_System_Manufacturer:       z.string().nullable(),
            Result_Obtained_From:           z.string().nullable(),
            Diagnosis:                      z.string().nullable(),
            Diagnosis_Remarks:              z.string().nullable(),
            ICD_Code:                       z.string().nullable(),
            Pregnancy_Week:                 z.number().nullable(),
            Pregnancy_Trimester:            z.string().nullable(),
            Medication:                     z.string().nullable(),
            Therapy:                        z.string().nullable(),
            Histological_Diagnosis:         z.string().nullable(),
            Organ:                          z.string().nullable(),
            Disease_Presentation:           z.string().nullable(),
            TNM_Class_T:                    z.string().nullable(),
            TNM_Class_N:                    z.string().nullable(),
            TNM_Class_M:                    z.string().nullable(),
            Tumour_Grade:                   z.string().nullable(),
            Tumour_Stage:                   z.string().nullable(),
            Viable_Cells__per_:             z.string().nullable(),
            Necrotic_Cells__per_:           z.string().nullable(),
            Tumour_Cells__per_:             z.string().nullable(),
            Proliferation_Rate__Ki67_per_:  z.string().nullable(),
            Estrogen_Receptor:              z.string().nullable(),
            Progesteron_Receptor:           z.string().nullable(),
            HER_2_Receptor:                 z.string().nullable(),
            Other_Gene_Mutations:           z.string().nullable(),
            Country_of_Collection:          z.string().nullable(),
            Date_of_Collection:             z.date().nullable(),
            Procurement_Type:               z.string().nullable(),
            Informed_Consent:               z.string().nullable(),
         })))
        .mutation(({ctx, input}) => {
            return ctx.prisma.samples.createMany({ data: input })
        }),

    // Read

    getDistinct: publicProcedure
        .input( z.string().optional() )
        .query(async ({ ctx, input }) => {
            switch (input) {
                case 'Price':
                    const result = await ctx.prisma.samples.findMany({
                        distinct: ['Price'],
                    });
                    return result.map(item => item.Price?.toString());
                case 'Quantity':
                    const result_1 = await ctx.prisma.samples.findMany({
                        distinct: ['Quantity'],
                    });
                    return result_1.map(item_1 => item_1.Quantity?.toString());
                case 'Unit':
                    const result_2 = await ctx.prisma.samples.findMany({
                        distinct: ['Unit'],
                    });
                    return result_2.map(item_2 => item_2.Unit);
                case 'Matrix':
                    const result_3 = await ctx.prisma.samples.findMany({
                        distinct: ['Matrix'],
                    });
                    return result_3.map(item_3 => item_3.Matrix);
                case 'Storage_Temperature':
                    const result_4 = await ctx.prisma.samples.findMany({
                        distinct: ['Storage_Temperature'],
                    });
                    return result_4.map(item_4 => item_4.Storage_Temperature);
                case 'Freeze_Thaw_Cycles':
                    const result_5 = await ctx.prisma.samples.findMany({
                        distinct: ['Freeze_Thaw_Cycles'],
                    });
                    return result_5.map(item_5 => item_5.Freeze_Thaw_Cycles?.toString());
                case 'Sample_Condition':
                    const result_6 = await ctx.prisma.samples.findMany({
                        distinct: ['Sample_Condition'],
                    });
                    return result_6.map(item_6 => item_6.Sample_Condition);
                case 'Gender':
                    const result_7 = await ctx.prisma.samples.findMany({
                        distinct: ['Gender'],
                    });
                    return result_7.map(item_7 => item_7.Gender);
                case 'Age':
                    const result_8 = await ctx.prisma.samples.findMany({
                        distinct: ['Age'],
                    });
                    return result_8.map(item_8 => item_8.Age?.toString());
                case 'Ethnicity':
                    const result_9 = await ctx.prisma.samples.findMany({
                        distinct: ['Ethnicity'],
                    });
                    return result_9.map(item_9 => item_9.Ethnicity);
                case 'BMI':
                    const result_10 = await ctx.prisma.samples.findMany({
                        distinct: ['BMI'],
                    });
                    return result_10.map(item_10 => item_10.BMI?.toString());
                case 'Lab_Parameter':
                    const result_11 = await ctx.prisma.samples.findMany({
                        distinct: ['Lab_Parameter'],
                    });
                    return result_11.map(item_11 => item_11.Lab_Parameter);
                case 'Result_Interpretation':
                    const result_12 = await ctx.prisma.samples.findMany({
                        distinct: ['Result_Interpretation'],
                    });
                    return result_12.map(item_12 => item_12.Result_Interpretation);
                case 'Result_Unit':
                    const result_13 = await ctx.prisma.samples.findMany({
                        distinct: ['Result_Unit'],
                    });
                    return result_13.map(item_13 => item_13.Result_Unit);
                case 'Test_Method':
                    const result_14 = await ctx.prisma.samples.findMany({
                        distinct: ['Test_Method'],
                    });
                    return result_14.map(item_14 => item_14.Test_Method);
                case 'Test_System':
                    const result_15 = await ctx.prisma.samples.findMany({
                        distinct: ['Test_System'],
                    });
                    return result_15.map(item_15 => item_15.Test_System);
                case 'Test_System_Manufacturer':
                    const result_16 = await ctx.prisma.samples.findMany({
                        distinct: ['Test_System_Manufacturer'],
                    });
                    return result_16.map(item_16 => item_16.Test_System_Manufacturer);
                case 'Diagnosis':
                    const result_17 = await ctx.prisma.samples.findMany({
                        distinct: ['Diagnosis'],
                    });
                    return result_17.map(item_17 => item_17.Diagnosis);
                case 'Diagnosis_Remarks':
                    const result_18 = await ctx.prisma.samples.findMany({
                        distinct: ['Diagnosis_Remarks'],
                    });
                    return result_18.map(item_18 => item_18.Diagnosis_Remarks);
                case 'ICD_Code':
                    const result_19 = await ctx.prisma.samples.findMany({
                        distinct: ['ICD_Code'],
                    });
                    return result_19.map(item_19 => item_19.ICD_Code);
                case 'Medication':
                    const result_20 = await ctx.prisma.samples.findMany({
                        distinct: ['Medication'],
                    });
                    return result_20.map(item_20 => item_20.Medication);
                case 'Therapy':
                    const result_21 = await ctx.prisma.samples.findMany({
                        distinct: ['Therapy'],
                    });
                    return result_21.map(item_21 => item_21.Therapy);
                case 'Disease_Presentation':
                    const result_22 = await ctx.prisma.samples.findMany({
                        distinct: ['Disease_Presentation'],
                    });
                    return result_22.map(item_22 => item_22.Disease_Presentation);
                case 'TNM_Class_T':
                    const result_23 = await ctx.prisma.samples.findMany({
                        distinct: ['TNM_Class_T'],
                    });
                    return result_23.map(item_23 => item_23.TNM_Class_T);
                case 'TNM_Class_N':
                    const result_24 = await ctx.prisma.samples.findMany({
                        distinct: ['TNM_Class_N'],
                    });
                    return result_24.map(item_24 => item_24.TNM_Class_N);
                case 'TNM_Class_M':
                    const result_25 = await ctx.prisma.samples.findMany({
                        distinct: ['TNM_Class_M'],
                    });
                    return result_25.map(item_25 => item_25.TNM_Class_M);
                case 'Tumour_Grade':
                    const result_26 = await ctx.prisma.samples.findMany({
                        distinct: ['Tumour_Grade'],
                    });
                    return result_26.map(item_26 => item_26.Tumour_Grade);
                case 'Estrogen_Receptor':
                    const result_27 = await ctx.prisma.samples.findMany({
                        distinct: ['Estrogen_Receptor'],
                    });
                    return result_27.map(item_27 => item_27.Estrogen_Receptor);
                case 'HER_2_Receptor':
                    const result_28 = await ctx.prisma.samples.findMany({
                        distinct: ['HER_2_Receptor'],
                    });
                    return result_28.map(item_28 => item_28.HER_2_Receptor);
                case 'Other_Gene_Mutations':
                    const result_29 = await ctx.prisma.samples.findMany({
                        distinct: ['Other_Gene_Mutations'],
                    });
                    return result_29.map(item_29 => item_29.Other_Gene_Mutations);
                case 'Country_of_Collection':
                    const result_30 = await ctx.prisma.samples.findMany({
                        distinct: ['Country_of_Collection'],
                    });
                    return result_30.map(item_30 => item_30.Country_of_Collection);
                case 'Date_of_Collection':
                    const result_31 = await ctx.prisma.samples.findMany({
                        distinct: ['Date_of_Collection'],
                    });
                    return result_31.map(item_31 => item_31.Date_of_Collection?.toString());
                case 'Procurement_Type':
                    const result_32 = await ctx.prisma.samples.findMany({
                        distinct: ['Procurement_Type'],
                    });
                    return result_32.map(item_32 => item_32.Procurement_Type);
                case 'Informed_Consent':
                    const result_33 = await ctx.prisma.samples.findMany({
                        distinct: ['Informed_Consent'],
                    });
                    return result_33.map(item_33 => item_33.Informed_Consent);
                default:
                    return []
            }
        }),

    getAll: publicProcedure
        .input(z.object({ 
            pages: z.number().optional(), 
            lines: z.number().optional(), 
            search: z.string().optional(), 
            filter: z.object({
                cbhMasterID: z.string().optional(), 
                cbhDonorID: z.string().optional(), 
                cbhSampleID: z.string().optional(), 
                price: z.object({
                    min: z.number().optional(), 
                    max: z.number().optional() 
                }), 
                matrix: z.array(z.string()), 
                quantity: z.object({
                    min: z.number().optional(), 
                    max: z.number().optional() 
                }), 
                unit: z.array(z.string()), 
                labParameter: z.array(z.string()), 
                resultInterpretation: z.array(z.string()), 
                resultUnit: z.array(z.string()), 
                diagnosis: z.array(z.string()), 
                ICDCode: z.array(z.string()),
            }) 
        }))
        .query(async ({ ctx, input }) => {

            const uniqueEntries = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: input.lines, 
                skip: (input.pages && input.lines) ? (input.pages -1) * input.lines : 0,
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: { 
                                contains: input.filter.cbhMasterID, 
                                mode: 'insensitive',
                            } 
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhSampleID, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Price: { 
                                lte: input.filter.price.max, 
                                gte: input.filter.price.min 
                            } 
                        },
                        { 
                            Matrix: { 
                                in: input.filter.matrix?.length > 0 ? input.filter.matrix : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Quantity: { 
                                lte: input.filter.quantity.max, 
                                gte: input.filter.quantity.min 
                            } 
                        },
                        { 
                            Unit: { 
                                in: input.filter.unit?.length > 0 ? input.filter.unit : undefined,
                                mode: 'insensitive'
                            } 
                        },
                        { 
                            Lab_Parameter: { 
                                in: input.filter.labParameter?.length > 0 ? input.filter.labParameter : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Interpretation: { 
                                in: input.filter.resultInterpretation?.length > 0 ? input.filter.resultInterpretation : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Unit: { 
                                in: input.filter.resultUnit?.length > 0 ? input.filter.resultUnit : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Diagnosis: { 
                                in: input.filter.diagnosis?.length > 0 ? input.filter.diagnosis : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            ICD_Code: { 
                                in: input.filter.ICDCode?.length > 0 ? input.filter.ICDCode : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        {
                            OR: [
                                { 
                                    CBH_Master_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive',
                                    } 
                                },
                                { 
                                    CBH_Donor_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    CBH_Sample_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Matrix: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Lab_Parameter: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Result_Interpretation: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Result_Unit: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Diagnosis: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    ICD_Code: { 
                                        contains: input.search,
                                        mode: 'insensitive' 
                                    } 
                                },
                            ]
                        }
                    ]
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
                select: {
                    CBH_Sample_ID: true
                }
            });

            const returnLength : string[] = uniqueEntries.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [];
            
            return ctx.prisma.samples.findMany({ 
                where: {
                    CBH_Sample_ID: {
                        in: returnLength
                    }
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
            });
        }),

    // Update
    update: publicProcedure
        .input( z.object({
            id:                             z.string().optional(),
            CBH_Donor_ID:                   z.string().nullable(),
            CBH_Master_ID:                  z.string().nullable(),
            CBH_Sample_ID:                  z.string().nullable(),
            Price:                          z.number().nullable(),
            Quantity:                       z.number().nullable(),
            Unit:                           z.string().nullable(),
            Matrix:                         z.string().nullable(),
            Storage_Temperature:            z.string().nullable(),
            Freeze_Thaw_Cycles:             z.number().nullable(),
            Sample_Condition:               z.string().nullable(),
            Infectious_Disease_Test_Result: z.string().nullable(),
            Gender:                         z.string().nullable(),
            Age:                            z.number().nullable(),
            Ethnicity:                      z.string().nullable(),
            BMI:                            z.number().nullable(),
            Lab_Parameter:                  z.string().nullable(),
            Result_Interpretation:          z.string().nullable(),
            Result_Raw:                     z.string().nullable(),
            Result_Numerical:               z.number().nullable(),
            Result_Unit:                    z.string().nullable(),
            Cut_Off_Raw:                    z.string().nullable(),
            Cut_Off_Numerical:              z.number().nullable(),
            Test_Method:                    z.string().nullable(),
            Test_System:                    z.string().nullable(),
            Test_System_Manufacturer:       z.string().nullable(),
            Result_Obtained_From:           z.string().nullable(),
            Diagnosis:                      z.string().nullable(),
            Diagnosis_Remarks:              z.string().nullable(),
            ICD_Code:                       z.string().nullable(),
            Pregnancy_Week:                 z.number().nullable(),
            Pregnancy_Trimester:            z.string().nullable(),
            Medication:                     z.string().nullable(),
            Therapy:                        z.string().nullable(),
            Histological_Diagnosis:         z.string().nullable(),
            Organ:                          z.string().nullable(),
            Disease_Presentation:           z.string().nullable(),
            TNM_Class_T:                    z.string().nullable(),
            TNM_Class_N:                    z.string().nullable(),
            TNM_Class_M:                    z.string().nullable(),
            Tumour_Grade:                   z.string().nullable(),
            Tumour_Stage:                   z.string().nullable(),
            Viable_Cells__per_:             z.string().nullable(),
            Necrotic_Cells__per_:           z.string().nullable(),
            Tumour_Cells__per_:             z.string().nullable(),
            Proliferation_Rate__Ki67_per_:  z.string().nullable(),
            Estrogen_Receptor:              z.string().nullable(),
            Progesteron_Receptor:           z.string().nullable(),
            HER_2_Receptor:                 z.string().nullable(),
            Other_Gene_Mutations:           z.string().nullable(),
            Country_of_Collection:          z.string().nullable(),
            Date_of_Collection:             z.date().nullable(),
            Procurement_Type:               z.string().nullable(),
            Informed_Consent:               z.string().nullable(),
        }))
        .mutation(({ctx,input}) => {
            return ctx.prisma.samples.update({
                where: {
                    id: input.id,
                },
                data: {
                    CBH_Donor_ID:                   input.CBH_Donor_ID,
                    CBH_Master_ID:                  input.CBH_Master_ID,
                    CBH_Sample_ID:                  input.CBH_Sample_ID,
                    Price:                          input.Price,
                    Quantity:                       input.Quantity,
                    Unit:                           input.Unit,
                    Matrix:                         input.Matrix,
                    Storage_Temperature:            input.Storage_Temperature,
                    Freeze_Thaw_Cycles:             input.Freeze_Thaw_Cycles,
                    Sample_Condition:               input.Sample_Condition,
                    Infectious_Disease_Test_Result: input.Infectious_Disease_Test_Result,
                    Gender:                         input.Gender,
                    Age:                            input.Age,
                    Ethnicity:                      input.Ethnicity,
                    BMI:                            input.BMI,
                    Lab_Parameter:                  input.Lab_Parameter,
                    Result_Interpretation:          input.Result_Interpretation,
                    Result_Raw:                     input.Result_Raw,
                    Result_Numerical:               input.Result_Numerical,
                    Result_Unit:                    input.Result_Unit,
                    Cut_Off_Raw:                    input.Cut_Off_Raw,
                    Cut_Off_Numerical:              input.Cut_Off_Numerical,
                    Test_Method:                    input.Test_Method,
                    Test_System:                    input.Test_System,
                    Test_System_Manufacturer:       input.Test_System_Manufacturer,
                    Result_Obtained_From:           input.Result_Obtained_From,
                    Diagnosis:                      input.Diagnosis,
                    Diagnosis_Remarks:              input.Diagnosis_Remarks,
                    ICD_Code:                       input.ICD_Code,
                    Pregnancy_Week:                 input.Pregnancy_Week,
                    Pregnancy_Trimester:            input.Pregnancy_Trimester,
                    Medication:                     input.Medication,
                    Therapy:                        input.Therapy,
                    Histological_Diagnosis:         input.Histological_Diagnosis,
                    Organ:                          input.Organ,
                    Disease_Presentation:           input.Disease_Presentation,
                    TNM_Class_T:                    input.TNM_Class_T,
                    TNM_Class_N:                    input.TNM_Class_N,
                    TNM_Class_M:                    input.TNM_Class_M,
                    Tumour_Grade:                   input.Tumour_Grade,
                    Tumour_Stage:                   input.Tumour_Stage,
                    Viable_Cells__per_:             input.Viable_Cells__per_,
                    Necrotic_Cells__per_:           input.Necrotic_Cells__per_,
                    Tumour_Cells__per_:             input.Tumour_Cells__per_,
                    Proliferation_Rate__Ki67_per_:  input.Proliferation_Rate__Ki67_per_,
                    Estrogen_Receptor:              input.Estrogen_Receptor,
                    Progesteron_Receptor:           input.Progesteron_Receptor,
                    HER_2_Receptor:                 input.HER_2_Receptor,
                    Other_Gene_Mutations:           input.Other_Gene_Mutations,
                    Country_of_Collection:          input.Country_of_Collection,
                    Date_of_Collection:             input.Date_of_Collection,
                    Procurement_Type:               input.Procurement_Type,
                    Informed_Consent:               input.Informed_Consent,
                },
            })
        }),

    // Delete
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input}) => {
            return ctx.prisma.samples.delete({
                where: {
                    id: input.id,
                },
            });
        }),
    
    deleteAll: publicProcedure
        .mutation(async ({ ctx }) => {
            return ctx.prisma.samples.deleteMany({})
        }),

    // Counts all entries in table
    countExpert: publicProcedure
        .input( z.object({ query: z.string() }) )
        .query(async ({input}) => {

            if (!(input.query === null || input.query === undefined || input.query === "")) {
                const result = await prisma.$queryRawUnsafe<{ _count: number }[]>(`SELECT COUNT(DISTINCT "CBH_Sample_ID")::integer as "_count" FROM "Samples" WHERE `+ input.query +`;`)
                return result[0]?._count;
            } else {
                const result = await prisma.$queryRawUnsafe<{ _count: number }[]>(`SELECT COUNT(DISTINCT "CBH_Sample_ID")::integer as "_count" FROM "Samples";`)
                return result[0]?._count;
            }            
        }),

    countNormal: publicProcedure
        .input(z.object({ 
            search: z.string().optional(), 
            filter: z.object({
                cbhMasterID: z.string().optional(), 
                cbhDonorID: z.string().optional(), 
                cbhSampleID: z.string().optional(), 
                price: z.object({
                    min: z.number().optional(), 
                    max: z.number().optional() 
                }), 
                matrix: z.array(z.string()), 
                quantity: z.object({
                    min: z.number().optional(), 
                    max: z.number().optional() 
                }), 
                unit: z.array(z.string()), 
                labParameter: z.array(z.string()), 
                resultInterpretation: z.array(z.string()), 
                resultUnit: z.array(z.string()), 
                diagnosis: z.array(z.string()), 
                ICDCode: z.array(z.string()),
            }) 
        }))
        .query(async ({ctx, input}) => {
            const result = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: { 
                                contains: input.filter.cbhMasterID, 
                                mode: 'insensitive',
                            } 
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhSampleID, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Price: { 
                                lte: input.filter.price.max, 
                                gte: input.filter.price.min 
                            } 
                        },
                        { 
                            Matrix: { 
                                in: input.filter.matrix?.length > 0 ? input.filter.matrix : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Quantity: { 
                                lte: input.filter.quantity.max, 
                                gte: input.filter.quantity.min 
                            } 
                        },
                        { 
                            Unit: { 
                                in: input.filter.unit?.length > 0 ? input.filter.unit : undefined,
                                mode: 'insensitive'
                            } 
                        },
                        { 
                            Lab_Parameter: { 
                                in: input.filter.labParameter?.length > 0 ? input.filter.labParameter : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Interpretation: { 
                                in: input.filter.resultInterpretation?.length > 0 ? input.filter.resultInterpretation : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Unit: { 
                                in: input.filter.resultUnit?.length > 0 ? input.filter.resultUnit : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Diagnosis: { 
                                in: input.filter.diagnosis?.length > 0 ? input.filter.diagnosis : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            ICD_Code: { 
                                in: input.filter.ICDCode?.length > 0 ? input.filter.ICDCode : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        {
                            OR: [
                                { 
                                    CBH_Master_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive',
                                    } 
                                },
                                { 
                                    CBH_Donor_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    CBH_Sample_ID: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Matrix: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Lab_Parameter: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Result_Interpretation: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Result_Unit: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    Diagnosis: { 
                                        contains: input.search, 
                                        mode: 'insensitive' 
                                    } 
                                },
                                { 
                                    ICD_Code: { 
                                        contains: input.search,
                                        mode: 'insensitive' 
                                    } 
                                },
                            ]
                        }
                    ]
                },
            });   
            
            return result.length
        }),

    applyFilter: publicProcedure
        .input(z.object({ pagelength: z.number(), pages: z.number(), group: groupSchema}))
        .query(async ({ ctx, input }) => {
            
            //Replace this later
            function getOperator(type: string): string {
                switch (type) {
                  case 'equal':
                    return '=';
                  case 'in':
                    return 'IN';
                  case 'less':
                    return '<';
                  case 'lessequal':
                    return '<=';
                  case 'more':
                    return '>';
                  case 'moreequal':
                    return '>=';
                  case 'between':
                    return 'BETWEEN';
                  default:
                    throw new Error(`Invalid filter type: ${type}`);
                }
              }
              //^^^^^^

            function BuildQuery(group: Group): Prisma.Sql {

                let sql = '';
                //let sql = (Prisma.sql``); 
                
                //If group isn't undefined and has the activated parameter
                if (group !== undefined && group.activated === true) {
                    
                    //Adds the link (and/or) and calls this function to add all child groups
                    //If there are groups within group
                    if (group.groups && group.groups.length > 0) {
                        //loop trough each groups element.
                        group.groups.map((g, i) => {
                            //If it's not the first element and the sql string isn't empty
                            if (i > 0 && sql !== '') {
                                //add the link for this element
                                sql += ` ${group.link.toUpperCase()} `;
                            }
                            //and build the string for this element.
                            sql += BuildQuery(g)
                        });
                    }

                    //Adds a link if there is already another opertaion in the sql string and a new filter is present.
                    //If the sql string isn't empty and there is a filter greater than 0
                    if (sql !== "" && group.filter && group.filter?.length > 0) {
                        //loop trough each filter element
                        for (let i = 0; i < group.filter.length; i++) {
                            //and if all required paramters are present
                            if (group.filter[i] && group.filter[i]?.col && group.filter[i]?.type && group.filter[i]?.values && group.filter[i]?.values.length !== 0 && group.filter[i]?.activated === true) {
                                //add the link for this element.
                                sql += ` ${group.link.toUpperCase()} `;
                                break;
                            }
                        }
                    }

                    let filterCount = 0;

                    //If there are filters present
                    if (group.filter.length > 0) {
                        //loop through each filter element
                        for (let i = 0; i < group.filter.length; i++) {
                           
                            //Create a new temporary sql string.
                            let tempSql = ''

                            //And if all required parameters are present
                            if (group.filter[i] && group.filter[i]?.col && group.filter[i]?.type && group.filter[i]?.values && group.filter[i]?.values.length !== 0 && (getOperator(group.filter[i]?.type ?? 'invalid')) !== 'invalid' && group.filter[i]?.activated === true) {

                                switch (group.not) {
                                    case false:
                                        switch (group.filter[0]?.col) {
                                            case "Price":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Quantity":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Unit":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Unit" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Unit" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Matrix":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Storage_Temperature":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Freeze_Thaw_Cycles":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Sample_Condition":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Sample_Condition" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Sample_Condition" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Gender":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Gender" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Gender" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Age":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Ethnicity":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "BMI":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI" = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Lab_Parameter":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Lab_Parameter" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Lab_Parameter" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Result_Interpretation":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Result_Interpretation" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Result_Interpretation" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Test_System_Manufacturer":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Test_System_Manufacturer" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Test_System_Manufacturer" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Diagnosis":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Diagnosis_Remarks":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis_Remarks" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis_Remarks" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "ICD_Code":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"ICD_Code" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"ICD_Code" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Medication":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Medication" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Medication" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Therapy":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Therapy" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Therapy" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_T":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_N":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_N" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_N" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_M":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_M" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_M" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Tumour_Grade":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Tumour_Grade" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Tumour_Grade" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Estrogen_Receptor":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Estrogen_Receptor" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Estrogen_Receptor" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "HER_2_Receptor":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"HER_2_Receptor" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"HER_2_Receptor" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Other_Gene_Mutations":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Other_Gene_Mutations" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Other_Gene_Mutations" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Country_of_Collection":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Country_of_Collection" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Country_of_Collection" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Date_of_Collection":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Date_of_Collection" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Date_of_Collection" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Informed_Consent":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Informed_Consent" = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Informed_Consent" IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                        }
                                    case true:
                                        switch (group.filter[0]?.col) {
                                            case "Price":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Price" NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Quantity":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity" < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity"  NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity"  NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity"  NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Quantity"  NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Unit":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Unit"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Unit"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Matrix":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Storage_Temperature":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Storage_Temperature"  NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Freeze_Thaw_Cycles":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Freeze_Thaw_Cycles"  NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Sample_Condition":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Sample_Condition"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Sample_Condition"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Gender":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Gender"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Gender"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Age":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Age"  NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Ethnicity":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "BMI":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                    case "less":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT < ${group.filter[0].values[0]}`;
                                                    case "lessequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT <= ${group.filter[0].values[0]}`;
                                                    case "more":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT = ${group.filter[0].values[0]}`;
                                                    case "moreequal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT = ${group.filter[0].values[0]}`;
                                                    case "between":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"BMI"  NOT = ${group.filter[i]?.values.map(v => `'${v}'`).join(' AND ') ?? ""}`;
                                                }
                                            break;
                                            case "Lab_Parameter":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Lab_Parameter"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Lab_Parameter"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Result_Interpretation":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Result_Interpretation"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Result_Interpretation"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Test_System_Manufacturer":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Test_System_Manufacturer"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Test_System_Manufacturer"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Diagnosis":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Diagnosis_Remarks":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis_Remarks"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Diagnosis_Remarks"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "ICD_Code":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"ICD_Code"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"ICD_Code"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Medication":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Medication"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Medication"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Therapy":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Therapy"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Therapy"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_T":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Matrix"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_N":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_N"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_N"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "TNM_Class_M":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_M"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"TNM_Class_M"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Tumour_Grade":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Tumour_Grade"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Tumour_Grade"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Estrogen_Receptor":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Estrogen_Receptor"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Estrogen_Receptor"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "HER_2_Receptor":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"HER_2_Receptor"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"HER_2_Receptor"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Other_Gene_Mutations":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Other_Gene_Mutations"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Other_Gene_Mutations"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Country_of_Collection":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Country_of_Collection"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Country_of_Collection"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Date_of_Collection":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Date_of_Collection"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Date_of_Collection"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                            case "Informed_Consent":
                                                switch (group.filter[0].type) {
                                                    case "equal":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Informed_Consent"  NOT = ${group.filter[0].values[0]}`;
                                                    case "in":
                                                        console.log(group.filter[0].values[0])
                                                        return Prisma.sql`"Informed_Consent"  NOT IN ${group.filter[i]?.values.map(v => `'${v}'`).join(', ') ?? ""}`;
                                                }
                                            break;
                                        }
                                    break;
                                }            
                            }
                        }
                    }
                }
                return Prisma.empty
            }

            //Pagination
            const offset = (input.pages && input.pagelength) ? (input.pages -1) * input.pagelength : 0

            let query = Prisma.sql`SELECT DISTINCT "CBH_Sample_ID" FROM "Samples" WHERE ${BuildQuery(input.group)} ORDER BY "CBH_Sample_ID" ASC LIMIT ${input.pagelength.toString()} OFFSET ${offset.toString()};`;

            //If the string is still empty
            if (BuildQuery(input.group) == Prisma.empty) {
                //just return everything.
                return ctx.prisma.samples.findMany({                    
                    take: input.pagelength, 
                    skip: offset,
                    orderBy: {
                        CBH_Sample_ID: 'desc',
                    },
                })
            } else {
                console.log(query)
                console.log(BuildQuery(input.group))

                //If not,
                //get all entries with the filter applied
                const uniqueEntries = await prisma.$queryRaw<{ CBH_Sample_ID : string }[]>`SELECT DISTINCT "CBH_Sample_ID" FROM "Samples" WHERE ${BuildQuery(input.group)} ORDER BY "CBH_Sample_ID" ASC LIMIT ${BigInt(input.pagelength)} OFFSET ${BigInt(offset)};`
                //and all unique entries for pagination
                const returnLength : string[] = uniqueEntries.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [] ;
                
                //and return the samples
                return ctx.prisma.samples.findMany({ 
                    where: {
                        CBH_Sample_ID: {
                            in: returnLength
                        }
                    },
                    orderBy: {
                        CBH_Sample_ID: 'desc',
                    },
                });
                
            }
        })
})