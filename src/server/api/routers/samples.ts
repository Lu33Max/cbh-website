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
                case 'Matrix':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Matrix'],
                        select: {
                            Matrix: true,
                        },
                    }).then(result => result.map(item => item.Matrix));
                case 'Unit':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Unit'],
                        select: {
                            Unit: true,
                        },
                    }).then(result => result.map(item => item.Unit));
                case 'Storage_Temperature':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Storage_Temperature'],
                        select: {
                            Storage_Temperature: true,
                        },
                    }).then(result => result.map(item => item.Storage_Temperature));
                case 'Lab_Parameter':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Lab_Parameter'],
                        select: {
                            Lab_Parameter: true,
                        },
                    }).then(result => result.map(item => item.Lab_Parameter));
                case 'Sample_Condition':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Sample_Condition'],
                        select: {
                            Sample_Condition: true,
                        },
                    }).then(result => result.map(item => item.Sample_Condition));
                case 'Infectious_Disease_Test_Result':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Infectious_Disease_Test_Result'],
                        select: {
                            Infectious_Disease_Test_Result: true,
                        },
                    }).then(result => result.map(item => item.Infectious_Disease_Test_Result));
                case 'Ethnicity':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Ethnicity'],
                        select: {
                            Ethnicity: true,
                        },
                    }).then(result => result.map(item => item.Ethnicity));
                case 'Gender':
                    return ctx.prisma.samples.findMany({ 
                        distinct: ['Gender'],
                        select: {
                            Gender: true,
                        },
                    }).then(result => result.map(item => item.Gender));
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
                default:
                    throw new Error(`Invalid column name: ${input}`);
            }
        }),
})

function getValue(obj: string | number): string {
    return `${obj}`
}