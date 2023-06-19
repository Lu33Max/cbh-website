import { ExampleSample, SampleSchema } from "~/common/database/samples";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Prisma, type Samples } from "@prisma/client";
import { GroupFilterSchema, GroupSchema, NormalFilterSchema, type IGroup, type INormalFilter } from "~/common/filter/filter";
import { type OptionalSamples } from "~/components/search/table";

export const sampleRouter = createTRPCRouter({

    // Create
    createMany: publicProcedure
        .input(z.array(SampleSchema))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.samples.createMany({ data: input })
        }),

    create: publicProcedure
        .input(SampleSchema)
        .mutation(async ({ ctx, input}) => {
            return ctx.prisma.samples.create({ data: input })
        }),

    // Read
    getDistinct: publicProcedure
        .input(z.string().optional())
        .query(async ({ ctx, input }) => {
            type SampleKey = keyof Samples

            if(Object.getOwnPropertyNames(SampleSchema.shape).find(item => item === input)){
                const result = await ctx.prisma.samples.findMany({
                    distinct: [input as Prisma.SamplesScalarFieldEnum]
                })
                return result.map(item => getProperty(item, input as SampleKey));
            }

            return []
        }),

    getAll: publicProcedure
        .input(z.object({
            pages: z.number(),
            lines: z.number(),
            search: z.string().optional(),
            filter: NormalFilterSchema
        }))
        .query(async ({ ctx, input }) => {

            const optionalUniqueSampleIDs = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: input.lines,
                skip: (input.pages && input.lines) ? (input.pages - 1) * input.lines : 0,
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: { 
                                contains: input.filter.cbhMasterID.value, 
                                mode: 'insensitive',
                            }
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID.value, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhSampleID.value, 
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
                                in: input.filter.matrix?.value.length > 0 ? input.filter.matrix.value : undefined, 
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
                                in: input.filter.unit?.value.length  > 0 ? input.filter.unit.value : undefined,
                                mode: 'insensitive'
                            }
                        },
                        { 
                            Lab_Parameter: { 
                                in: input.filter.labParameter?.value.length > 0 ? input.filter.labParameter.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Interpretation: { 
                                in: input.filter.resultInterpretation?.value.length > 0 ? input.filter.resultInterpretation.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Unit: { 
                                in: input.filter.resultUnit?.value.length > 0 ? input.filter.resultUnit.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Diagnosis: { 
                                in: input.filter.diagnosis?.value.length > 0 ? input.filter.diagnosis.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            ICD_Code: { 
                                in: input.filter.ICDCode?.value.length > 0 ? input.filter.ICDCode.value : undefined, 
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

            const allOptionals = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: { 
                                contains: input.filter.cbhMasterID.value, 
                                mode: 'insensitive',
                            }
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID.value, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhSampleID.value, 
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
                                in: input.filter.matrix?.value.length > 0 ? input.filter.matrix.value : undefined, 
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
                                in: input.filter.unit?.value.length  > 0 ? input.filter.unit.value : undefined,
                                mode: 'insensitive'
                            }
                        },
                        { 
                            Lab_Parameter: { 
                                in: input.filter.labParameter?.value.length > 0 ? input.filter.labParameter.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Interpretation: { 
                                in: input.filter.resultInterpretation?.value.length > 0 ? input.filter.resultInterpretation.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Unit: { 
                                in: input.filter.resultUnit?.value.length > 0 ? input.filter.resultUnit.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Diagnosis: { 
                                in: input.filter.diagnosis?.value.length > 0 ? input.filter.diagnosis.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            ICD_Code: { 
                                in: input.filter.ICDCode?.value.length > 0 ? input.filter.ICDCode.value : undefined, 
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

            const optionalsLength = allOptionals.length

            const mandatoryUniqueSampleIDs = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: anyOptionalsNormal(input.filter) ? input.lines - optionalUniqueSampleIDs.length : 0,
                skip: optionalUniqueSampleIDs.length > 0 ? 0 : (input.lines - optionalsLength % input.lines) + input.lines * (input.pages - (Math.floor(optionalsLength / input.lines) + 2)),
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: {
                                contains: input.filter.cbhMasterID.mandatory? input.filter.cbhMasterID.value : undefined,
                                mode: 'insensitive',
                            }
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID.mandatory? input.filter.cbhDonorID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhSampleID.mandatory? input.filter.cbhSampleID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Price: { 
                                lte: input.filter.price.mandatory? input.filter.price.max : undefined,
                                gte: input.filter.price.mandatory? input.filter.price.min : undefined, 
                            } 
                        },
                        { 
                            OR: [
                                {
                                    Matrix: { 
                                        in: (input.filter.matrix.mandatory && input.filter.matrix?.value.length > 0) ? input.filter.matrix.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Matrix: {
                                        notIn: (!input.filter.matrix.mandatory && input.filter.matrix?.value.length > 0) ? input.filter.matrix.value : undefined,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    Matrix: !input.filter.matrix.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            Quantity: { 
                                lte: input.filter.quantity.mandatory? input.filter.quantity.max : undefined,
                                gte: input.filter.quantity.mandatory? input.filter.quantity.min : undefined, 
                            } 
                        },
                        { 
                            OR: [
                                {
                                    Unit: { 
                                        in: (input.filter.unit.mandatory && input.filter.unit?.value.length > 0) ? input.filter.unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Unit: {
                                        notIn: (!input.filter.unit.mandatory && input.filter.unit?.value.length > 0) ? input.filter.unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Unit: !input.filter.unit.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Lab_Parameter: { 
                                        in: (input.filter.labParameter.mandatory && input.filter.labParameter?.value.length > 0) ? input.filter.labParameter.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Lab_Parameter: {
                                        notIn: (!input.filter.labParameter.mandatory && input.filter.labParameter?.value.length > 0) ? input.filter.labParameter.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Lab_Parameter: !input.filter.labParameter.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Result_Interpretation: { 
                                        in: (input.filter.resultInterpretation.mandatory && input.filter.resultInterpretation?.value.length > 0) ? input.filter.resultInterpretation.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Result_Interpretation: {
                                        notIn: (!input.filter.resultInterpretation.mandatory && input.filter.resultInterpretation?.value.length > 0) ? input.filter.resultInterpretation.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Result_Interpretation: !input.filter.resultInterpretation.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Result_Unit: { 
                                        in: (input.filter.resultUnit.mandatory && input.filter.resultUnit?.value.length > 0) ? input.filter.resultUnit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Result_Unit: {
                                        notIn: (!input.filter.resultUnit.mandatory && input.filter.resultUnit?.value.length > 0) ? input.filter.resultUnit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Result_Unit: !input.filter.resultUnit.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Diagnosis: { 
                                        in: (input.filter.diagnosis.mandatory && input.filter.diagnosis?.value.length > 0) ? input.filter.diagnosis.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Diagnosis: {
                                        notIn: (!input.filter.diagnosis.mandatory && input.filter.diagnosis?.value.length > 0) ? input.filter.diagnosis.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Diagnosis: !input.filter.diagnosis.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    ICD_Code: { 
                                        in: (input.filter.ICDCode.mandatory && input.filter.ICDCode?.value.length > 0) ? input.filter.ICDCode.value : undefined,
                                        notIn: (!input.filter.ICDCode.mandatory && input.filter.ICDCode?.value.length > 0) ? input.filter.ICDCode.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    ICD_Code: !input.filter.ICDCode.mandatory ? null : undefined
                                }
                            ]
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
                        },
                    ]
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
                select: {
                    CBH_Sample_ID: true
                }
            });

            const optionalUniqueSampleIDStrings : string[] = optionalUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [];
            const mandatoryUniqueSampleIDStrings : string[] = mandatoryUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [];

            const optionalEntries = await ctx.prisma.samples.findMany({
                where: {
                    CBH_Sample_ID: {
                        in: optionalUniqueSampleIDStrings
                    }
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
            })

            const mandatoryEntries = await ctx.prisma.samples.findMany({
                where: {
                    CBH_Sample_ID: {
                        in: mandatoryUniqueSampleIDStrings
                    }
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
            })

            const allEntriesWithOptionals: OptionalSamples[] = optionalEntries.map(e => {return {optional: true, data: e}})
            const mandatoryEntriesWithOptionals: OptionalSamples[] = mandatoryEntries.map(e => {return {optional: false, data: e}}) 

            allEntriesWithOptionals.push(...mandatoryEntriesWithOptionals)

            return allEntriesWithOptionals
        }),

    // Update
    update: publicProcedure
        .input(SampleSchema)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.samples.update({
                where: {
                    id: input.id,
                },
                data: input
            })
        }),

    // Delete
    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
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
        .input( z.object({ group: GroupSchema }) )
        .query(async ({ input }) => {
            const mandatoryQuery = BuildQuery(input.group, true)
            const optionalQuery = BuildQuery(input.group, false)

            const resultMandatory = anyOptionalsExpert(input.group) ? await prisma.$queryRaw<{ _count: number }[]>`SELECT COUNT(DISTINCT "CBH_Sample_ID")::integer as "_count" FROM "Samples" ${mandatoryQuery !== Prisma.empty ? Prisma.sql`WHERE ${mandatoryQuery}` : Prisma.empty};` : [{ _count: 0 }]
            const resultOptional = await prisma.$queryRaw<{ _count: number }[]>`SELECT COUNT(DISTINCT "CBH_Sample_ID")::integer as "_count" FROM "Samples" ${optionalQuery !== Prisma.empty ? Prisma.sql`WHERE ${optionalQuery}` : Prisma.empty};`

            return (resultMandatory[0]?._count ?? 0) + (resultOptional[0]?._count ?? 0);
        }),

    countNormal: publicProcedure
        .input(z.object({ 
            pages: z.number().optional(), 
            lines: z.number().optional(), 
            search: z.string().optional(), 
            filter: NormalFilterSchema
        }))
        .query(async ({ctx, input}) => {

            const result = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: input.lines, 
                skip: (input.pages && input.lines) ? (input.pages -1) * input.lines : 0,
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: {
                                contains: input.filter.cbhMasterID.mandatory? input.filter.cbhMasterID.value : undefined,
                                mode: 'insensitive',
                            } 
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.cbhDonorID.mandatory? input.filter.cbhDonorID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.cbhDonorID.mandatory? input.filter.cbhSampleID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Price: { 
                                lte: input.filter.price.mandatory? input.filter.price.max : undefined,
                                gte: input.filter.price.mandatory? input.filter.price.min : undefined, 
                            } 
                        },
                        { 
                            Matrix: { 
                                in: (input.filter.matrix.mandatory && input.filter.matrix?.value.length > 0) ? input.filter.matrix.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Quantity: { 
                                lte: input.filter.quantity.mandatory? input.filter.quantity.max : undefined,
                                gte: input.filter.quantity.mandatory? input.filter.quantity.min : undefined, 
                            } 
                        },
                        { 
                            Unit: { 
                                in: (input.filter.unit.mandatory && input.filter.unit?.value.length > 0) ? input.filter.unit.value : undefined,
                                mode: 'insensitive'
                            } 
                        },
                        { 
                            Lab_Parameter: { 
                                in: (input.filter.labParameter.mandatory && input.filter.labParameter?.value.length > 0) ? input.filter.labParameter.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Interpretation: { 
                                in: (input.filter.resultInterpretation.mandatory && input.filter.resultInterpretation?.value.length > 0) ? input.filter.resultInterpretation.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Result_Unit: { 
                                in: (input.filter.resultUnit.mandatory && input.filter.resultUnit?.value.length > 0) ? input.filter.resultUnit.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Diagnosis: { 
                                in: (input.filter.diagnosis.mandatory && input.filter.diagnosis?.value.length > 0) ? input.filter.diagnosis.value : undefined, 
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            ICD_Code: { 
                                in: (input.filter.ICDCode.mandatory && input.filter.ICDCode?.value.length > 0) ? input.filter.ICDCode.value : undefined, 
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
            
            return result.length
        }),

    applyFilter: publicProcedure
        .input(z.object({ pagelength: z.number(), pages: z.number(), group: GroupSchema}))
        .query(async ({ ctx, input }) => {

            const offset = (input.pages && input.pagelength) ? (input.pages -1) * input.pagelength : 0
            const query = BuildQuery(input.group)

            //Pagination
            if (query === Prisma.empty) 
            {
                const uniqueSamples = await ctx.prisma.samples.findMany({
                    distinct: ['CBH_Sample_ID'],
                    take: input.pagelength,
                    skip: (input.pages && input.pagelength) ? (input.pages - 1) * input.pagelength : 0,
                    select: {
                        CBH_Sample_ID: true
                    }
                })

                const uniqueIDs = uniqueSamples.map(sample => sample.CBH_Sample_ID ?? "") ?? []

                const entries = await ctx.prisma.samples.findMany({
                    where: {
                        CBH_Sample_ID: {
                            in: uniqueIDs
                        }
                    },
                    orderBy: {
                        CBH_Sample_ID: 'desc',
                    },
                })

                const entriesWithOptionals: OptionalSamples[] = entries.map(e =>{return {optional: true, data: e}}) 
                return entriesWithOptionals
            } 
            else 
            {
                const queryForMandatory = BuildQuery(input.group, true)

                const optionalUniqueSampleIDs = await prisma.$queryRaw<{ CBH_Sample_ID : string }[]>`SELECT DISTINCT "CBH_Sample_ID" FROM "Samples" WHERE ${query} ORDER BY "CBH_Sample_ID" ASC LIMIT ${BigInt(input.pagelength)} OFFSET ${BigInt(offset)};`
                const allOptionals = await prisma.$queryRaw<{ CBH_Sample_ID : string }[]>`SELECT DISTINCT "CBH_Sample_ID" FROM "Samples" WHERE ${query} ORDER BY "CBH_Sample_ID" ASC;`

                const optionalsLength = allOptionals.length

                const mandatoryUniqueSampleIDs = await prisma.$queryRaw<{ CBH_Sample_ID : string }[]>`SELECT DISTINCT "CBH_Sample_ID" FROM "Samples" ${queryForMandatory !== Prisma.empty ? Prisma.sql`WHERE ${queryForMandatory}` : Prisma.empty} ORDER BY "CBH_Sample_ID" ASC LIMIT ${anyOptionalsExpert(input.group) ? input.pagelength - optionalUniqueSampleIDs.length : 0} OFFSET ${optionalUniqueSampleIDs.length > 0 ? 0 : (input.pagelength - optionalsLength % input.pagelength) + input.pagelength * (input.pages - (Math.floor(optionalsLength / input.pagelength) + 2))};`

                const allUniqueSampleIDStrings : string[] = optionalUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [];
                const mandatoryUniqueSampleIDStrings : string[] = mandatoryUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? [];

                const optionalEntries = await ctx.prisma.samples.findMany({
                    where: {
                        CBH_Sample_ID: {
                            in: allUniqueSampleIDStrings
                        }
                    },
                    orderBy: {
                        CBH_Sample_ID: 'desc',
                    },
                })

                const mandatoryEntries = await ctx.prisma.samples.findMany({
                    where: {
                        CBH_Sample_ID: {
                            in: mandatoryUniqueSampleIDStrings
                        }
                    },
                    orderBy: {
                        CBH_Sample_ID: 'desc',
                    },
                })

                const allEntriesWithOptionals: OptionalSamples[] = optionalEntries.map(e => {return {optional: true, data: e}})
                const mandatoryEntriesWithOptionals: OptionalSamples[] = mandatoryEntries.map(e => {return {optional: false, data: e}}) 

                allEntriesWithOptionals.push(...mandatoryEntriesWithOptionals)

                return allEntriesWithOptionals           
            }
        }),
})

function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]
}

function BuildQuery(group: IGroup, mandatoryOnly?: boolean): Prisma.Sql {

    const sqlArray : Prisma.Sql[] = []
    
    if (group !== undefined && group.activated === true) {
        
        if (group.groups && group.groups.length > 0) {
            group.groups.map((g) => {
                sqlArray.push(BuildQuery(g, mandatoryOnly))
            });
        }

        if (group.filter.length > 0) {

            type SampleKey = keyof typeof ExampleSample
            type FieldName<T> = string & keyof T
            const fieldNameString = <T>(name: FieldName<T>) => Prisma.sql([`lower("${name}")`])
            const fieldNameNumber = <T>(name: FieldName<T>) => Prisma.sql([`"${name}"`])
            const filterTypes = ["equal","in","less","lessequal","more","moreequal","between"]

            for (let i = 0; i < group.filter.length; i++) {
                try {
                    const currentFilter = GroupFilterSchema.parse(group.filter[i])
                    currentFilter.values = currentFilter.values.filter(o => o !== "")

                    if (currentFilter.values.length !== 0 && filterTypes.find(item => item === currentFilter.type) && currentFilter.activated && Object.getOwnPropertyNames(ExampleSample).find(item => item === currentFilter.col)) {
                        switch(currentFilter.type){
                            case "equal": 
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${typeof getProperty(ExampleSample, currentFilter.col as SampleKey) === "number" ? fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>) : fieldNameString<Samples>(currentFilter.col as FieldName<Samples>)} = ${typeof getProperty(ExampleSample, currentFilter.col as SampleKey) === "number" ? Number(currentFilter.values[0]) : currentFilter.values[0]?.toLowerCase()}`);
                                break;
                            case "in": 
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${typeof getProperty(ExampleSample, currentFilter.col as SampleKey) === "number" ? fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>) : fieldNameString<Samples>(currentFilter.col as FieldName<Samples>)} IN (${typeof getProperty(ExampleSample, currentFilter.col as SampleKey) === "number" ? Prisma.join(currentFilter.values.map(v => Number(v))) : Prisma.join(currentFilter.values.map(v => {return(v.toLowerCase())}))})`);
                                break;
                            case "less": 
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>)} < ${Number(currentFilter.values[0])}`);
                                break;
                            case "lessequal":
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>)} <= ${Number(currentFilter.values[0])}`);
                                break;
                            case "more": 
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>)} > ${Number(currentFilter.values[0])}`);
                                break;
                            case "moreequal": 
                                sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>)} >= ${Number(currentFilter.values[0])}`);
                                break;
                            case "between":
                                if (currentFilter.values[1] != undefined) {
                                    sqlArray.push(Prisma.sql`${(!group.not && !currentFilter.mandatory && mandatoryOnly) || (group.not && currentFilter.mandatory && mandatoryOnly) || (group.not && !mandatoryOnly) ? Prisma.sql`NOT ` : Prisma.empty}${fieldNameNumber<Samples>(currentFilter.col as FieldName<Samples>)} BETWEEN ${currentFilter.values.map(v => `'${Number(v)}'`).join(' AND ') ?? ""}`);
                                }
                                break;
                            default:
                                throw Error("Type not found")
                        }
                    }                  
                } catch (error){
                    sqlArray.push(Prisma.empty)
                }
            }
        }
    }

    let finalSql = sqlArray[0]

    if (finalSql != undefined) {
        for (let i = 1; i < sqlArray.length; i++) {
            if (sqlArray[i] != Prisma.empty) {
                if (group.link == "AND") {
                    finalSql = Prisma.sql`${finalSql} AND ${sqlArray[i]}` 
                } else {
                    finalSql = Prisma.sql`${finalSql} OR ${sqlArray[i]}` 
                }
            }
        }
        finalSql = Prisma.sql`(${finalSql})`
        return finalSql
    } else {
        return Prisma.empty
    }
}

function anyOptionalsNormal (filter: INormalFilter): boolean {
    return !(filter.ICDCode.mandatory && filter.cbhDonorID.mandatory && filter.cbhMasterID.mandatory && filter.cbhSampleID.mandatory && filter.diagnosis.mandatory && filter.labParameter.mandatory && filter.matrix.mandatory && filter.price.mandatory && filter.quantity.mandatory && filter.resultInterpretation.mandatory && filter.resultNumerical.mandatory && filter.resultUnit.mandatory)
}

function anyOptionalsExpert (filter: IGroup): boolean {

    let optional = false

    if(!filter.mandatory)
        optional = true

    filter.filter.forEach(element => {
        if(!element.mandatory){
            optional = true
        }
    });

    filter.groups.forEach(group => {
        if(anyOptionalsExpert(group)){
            optional = true
        }
    });

    return optional
}