import { Prisma, type Samples } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const sampleRouter = createTRPCRouter({

    // Get All or Filtered
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
        .query(({ ctx, input }) => {
            return ctx.prisma.samples.findMany({ 
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
            });
        }),

    // Counts all entries in table
    count: publicProcedure
    .query(({ctx}) => {
        return ctx.prisma.samples.count()
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

    //--- Test purpose only ----//
    test: publicProcedure
        .input(z.object({ obj: z.string().or(z.number()).optional()}))
        .query(({ ctx, input }) => {
            return ctx.prisma.$queryRaw<Samples[]>`SELECT * FROM "Samples" ${
                input.obj ? Prisma.sql`WHERE "cbhDonorID" = ${getValue(input.obj)}` : Prisma.empty
            }`
        }),

    simpleFilter: publicProcedure
        .input(z.object({ filters: z.object({ sampleID: z.array(z.string()), labParameter: z.array(z.string()) })}))
        .query(({ctx, input}) => {
            return "hi"
        }),
    //-------------------------//

    getDistinct: publicProcedure
        .input( z.string() )
        .query(({ ctx, input }) => {

            switch (input) {
                case 'Price':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Price'],
                      select: {
                        Price: true,
                      },
                    }).then(result => result.map(item => item.Price));
                  case 'Quantity':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Quantity'],
                      select: {
                        Quantity: true,
                      },
                    }).then(result => result.map(item => item.Quantity));
                  case 'Unit':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Unit'],
                      select: {
                        Unit: true,
                      },
                    }).then(result => result.map(item => item.Unit));
                  case 'Matrix':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Matrix'],
                      select: {
                        Matrix: true,
                      },
                    }).then(result => result.map(item => item.Matrix));
                  case 'Storage_Temperature':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Storage_Temperature'],
                      select: {
                        Storage_Temperature: true,
                      },
                    }).then(result => result.map(item => item.Storage_Temperature));
                  case 'Freeze_Thaw_Cycles':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Freeze_Thaw_Cycles'],
                      select: {
                        Freeze_Thaw_Cycles: true,
                      },
                    }).then(result => result.map(item => item.Freeze_Thaw_Cycles));
                  case 'Sample_Condition':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Sample_Condition'],
                      select: {
                        Sample_Condition: true,
                      },
                    }).then(result => result.map(item => item.Sample_Condition));
                  case 'Gender':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Gender'],
                      select: {
                        Gender: true,
                      },
                    }).then(result => result.map(item => item.Gender));
                  case 'Age':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Age'],
                      select: {
                        Age: true,
                      },
                    }).then(result => result.map(item => item.Age));
                  case 'Ethnicity':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Ethnicity'],
                      select: {
                        Ethnicity: true,
                      },
                    }).then(result => result.map(item => item.Ethnicity));
                  case 'BMI':
                    return ctx.prisma.samples.findMany({
                      distinct: ['BMI'],
                      select: {
                        BMI: true,
                      },
                    }).then(result => result.map(item => item.BMI));
                  case 'Lab_Parameter':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Lab_Parameter'],
                      select: {
                        Lab_Parameter: true,
                      },
                    }).then(result => result.map(item => item.Lab_Parameter));
                  case 'Result_Interpretation':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Result_Interpretation'],
                      select: {
                        Result_Interpretation: true,
                      },
                    }).then(result => result.map(item => item.Result_Interpretation));
                  case 'Result_Unit':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Result_Unit'],
                      select: {
                        Result_Unit: true,
                      },
                    }).then(result => result.map(item => item.Result_Unit));
                  case 'Test_Method':
                    return ctx.prisma.samples.findMany({
                      distinct: ['Test_Method'],
                      select: {
                        Test_Method: true,
                      },
                    }).then(result => result.map(item => item.Test_Method));
                    case 'Test_System':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Test_System'],
                            select: {
                                Test_System: true,
                            },
                        }).then(result => result.map(item => item.Test_System));
                    case 'Test_System_Manufacturer':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Test_System_Manufacturer'],
                            select: {
                                Test_System_Manufacturer: true,
                            },
                        }).then(result => result.map(item => item.Test_System_Manufacturer));
                    case 'Diagnosis':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Diagnosis'],
                            select: {
                                Diagnosis: true,
                            },
                        }).then(result => result.map(item => item.Diagnosis));
                    case 'Diagnosis_Remarks':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Diagnosis_Remarks'],
                            select: {
                                Diagnosis_Remarks: true,
                            },
                        }).then(result => result.map(item => item.Diagnosis_Remarks));
                    case 'ICD_Code':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['ICD_Code'],
                            select: {
                                ICD_Code: true,
                            },
                        }).then(result => result.map(item => item.ICD_Code));
                    case 'Medication':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Medication'],
                            select: {
                                Medication: true,
                            },
                        }).then(result => result.map(item => item.Medication));
                    case 'Therapy':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Therapy'],
                            select: {
                                Therapy: true,
                            },
                        }).then(result => result.map(item => item.Therapy));
                    case 'Disease_Presentation':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['Disease_Presentation'],
                            select: {
                                Disease_Presentation: true,
                            },
                        }).then(result => result.map(item => item.Disease_Presentation));
                    case 'TNM_Class_T':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['TNM_Class_T'],
                            select: {
                                TNM_Class_T: true,
                            },
                        }).then(result => result.map(item => item.TNM_Class_T));
                    case 'TNM_Class_N':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['TNM_Class_N'],
                            select: {
                                TNM_Class_N: true,
                            },
                        }).then(result => result.map(item => item.TNM_Class_N));
                    case 'TNM_Class_M':
                        return ctx.prisma.samples.findMany({ 
                            distinct: ['TNM_Class_M'],
                            select: {
                                TNM_Class_M: true,
                            },
                        }).then(result => result.map(item => item.TNM_Class_M));
                        case 'Tumour_Grade':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Tumour_Grade'],
                                select: {
                                    Tumour_Grade: true,
                                },
                            }).then(result => result.map(item => item.Tumour_Grade));
                        case 'Estrogen_Receptor':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Estrogen_Receptor'],
                                select: {
                                    Estrogen_Receptor: true,
                                },
                            }).then(result => result.map(item => item.Estrogen_Receptor));
                        case 'HER_2_Receptor':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['HER_2_Receptor'],
                                select: {
                                    HER_2_Receptor: true,
                                },
                            }).then(result => result.map(item => item.HER_2_Receptor));
                        case 'Other_Gene_Mutations':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Other_Gene_Mutations'],
                                select: {
                                    Other_Gene_Mutations: true,
                                },
                            }).then(result => result.map(item => item.Other_Gene_Mutations));
                        case 'Country_of_Collection':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Country_of_Collection'],
                                select: {
                                    Country_of_Collection: true,
                                },
                            }).then(result => result.map(item => item.Country_of_Collection));
                        case 'Date_of_Collection':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Date_of_Collection'],
                                select: {
                                    Date_of_Collection: true,
                                },
                            }).then(result => result.map(item => item.Date_of_Collection));
                        case 'Procurement_Type':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Procurement_Type'],
                                select: {
                                    Procurement_Type: true,
                                },
                            }).then(result => result.map(item => item.Procurement_Type));
                        case 'Informed_Consent':
                            return ctx.prisma.samples.findMany({ 
                                distinct: ['Informed_Consent'],
                                select: {
                                    Informed_Consent: true,
                                },
                            }).then(result => result.map(item => item.Informed_Consent));
                default:
                    throw new Error(`Invalid column name: ${input}`);
            }
        }),
})

function getValue(obj: string | number): string {
    return `${obj}`
}