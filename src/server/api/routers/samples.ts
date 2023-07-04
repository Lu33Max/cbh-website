import { ExampleSample, SampleSchema } from "~/common/database/samples";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { type Categories, Prisma, type Samples } from "@prisma/client";
import { GroupFilterSchema, GroupSchema, NormalFilterSchema, type IGroup, type INormalFilter } from "~/common/filter/filter";
import { type IOptionalSample } from "~/common/types";

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
            category: z.string(),
            filter: NormalFilterSchema
        }))
        .query(async ({ ctx, input }) => {
            let category: Categories[] = await ctx.prisma.categories.findMany({where: { mainCategory: input.category } })

            if(category === null || category.length === 0){
                category = await ctx.prisma.categories.findMany({where: { subCategory: input.category }})
            }

            const categoryString: string[] = []
            
            category.map((cat, i) => {
                const filter = cat.filter
                if(i !== category.length && category.length > 1){
                    filter?.slice(0, -1)

                }
                if(i !== 0){
                    filter?.slice(0, 1)
                }
                if(filter)
                    categoryString.push(filter)
            })

            const allOptionals = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                where: {
                    AND: [...mapOptional(input.filter, input.search), ...CategoryStringToObject(categoryString.join(", ") !== "" ? categoryString.join(", ") : "[]")]
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
                select: {
                    CBH_Sample_ID: true
                }
            });

            const optionalUniqueSampleIDs = allOptionals.slice((input.pages-1) * input.lines, input.pages * input.lines)
            const optionalsLength = allOptionals.length

            const mandatoryUniqueSampleIDs = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: anyOptionalsNormal(input.filter) ? input.lines - optionalUniqueSampleIDs.length : 0,
                skip: optionalUniqueSampleIDs.length > 0 ? 0 : (input.lines - optionalsLength % input.lines) + input.lines * (input.pages - (Math.floor(optionalsLength / input.lines) + 2)),
                where: {
                    AND: [
                        { 
                            CBH_Master_ID: {
                                contains: input.filter.CBH_Master_ID.mandatory? input.filter.CBH_Master_ID.value : undefined,
                                mode: 'insensitive',
                            }
                        },
                        { 
                            CBH_Donor_ID: { 
                                contains: input.filter.CBH_Donor_ID.mandatory? input.filter.CBH_Donor_ID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            CBH_Sample_ID: { 
                                contains: input.filter.CBH_Sample_ID.mandatory? input.filter.CBH_Sample_ID.value : undefined,
                                mode: 'insensitive' 
                            } 
                        },
                        { 
                            Price: { 
                                lte: input.filter.Price.mandatory ? input.filter.Price.max : undefined,
                                gte: input.filter.Price.mandatory ? input.filter.Price.min : undefined, 
                            } 
                        },
                        { 
                            OR: [
                                {
                                    Matrix: { 
                                        in: (input.filter.Matrix.mandatory && input.filter.Matrix?.value.length > 0) ? input.filter.Matrix.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Matrix: {
                                        notIn: (!input.filter.Matrix.mandatory && input.filter.Matrix?.value.length > 0) ? input.filter.Matrix.value : undefined,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    Matrix: !input.filter.Matrix.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            Quantity: { 
                                lte: input.filter.Quantity.mandatory ? input.filter.Quantity.max : undefined,
                                gte: input.filter.Quantity.mandatory ? input.filter.Quantity.min : undefined, 
                            } 
                        },
                        { 
                            OR: [
                                {
                                    Unit: { 
                                        in: (input.filter.Unit.mandatory && input.filter.Unit?.value.length > 0) ? input.filter.Unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Unit: {
                                        notIn: (!input.filter.Unit.mandatory && input.filter.Unit?.value.length > 0) ? input.filter.Unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Unit: !input.filter.Unit.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Lab_Parameter: { 
                                        in: (input.filter.Lab_Parameter.mandatory && input.filter.Lab_Parameter?.value.length > 0) ? input.filter.Lab_Parameter.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Lab_Parameter: {
                                        notIn: (!input.filter.Lab_Parameter.mandatory && input.filter.Lab_Parameter?.value.length > 0) ? input.filter.Lab_Parameter.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Lab_Parameter: !input.filter.Lab_Parameter.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Result_Interpretation: { 
                                        in: (input.filter.Result_Interpretation.mandatory && input.filter.Result_Interpretation?.value.length > 0) ? input.filter.Result_Interpretation.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Result_Interpretation: {
                                        notIn: (!input.filter.Result_Interpretation.mandatory && input.filter.Result_Interpretation?.value.length > 0) ? input.filter.Result_Interpretation.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Result_Interpretation: !input.filter.Result_Interpretation.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Result_Unit: { 
                                        in: (input.filter.Result_Unit.mandatory && input.filter.Result_Unit?.value.length > 0) ? input.filter.Result_Unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Result_Unit: {
                                        notIn: (!input.filter.Result_Unit.mandatory && input.filter.Result_Unit?.value.length > 0) ? input.filter.Result_Unit.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Result_Unit: !input.filter.Result_Unit.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    Diagnosis: { 
                                        in: (input.filter.Diagnosis.mandatory && input.filter.Diagnosis?.value.length > 0) ? input.filter.Diagnosis.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    Diagnosis: {
                                        notIn: (!input.filter.Diagnosis.mandatory && input.filter.Diagnosis?.value.length > 0) ? input.filter.Diagnosis.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                },
                                {
                                    Diagnosis: !input.filter.Diagnosis.mandatory ? null : undefined
                                }
                            ]
                        },
                        { 
                            OR: [
                                {
                                    ICD_Code: { 
                                        in: (input.filter.ICD_Code.mandatory && input.filter.ICD_Code?.value.length > 0) ? input.filter.ICD_Code.value : undefined,
                                        notIn: (!input.filter.ICD_Code.mandatory && input.filter.ICD_Code?.value.length > 0) ? input.filter.ICD_Code.value : undefined,
                                        mode: 'insensitive' 
                                    }
                                }, 
                                {
                                    ICD_Code: !input.filter.ICD_Code.mandatory ? null : undefined
                                }
                            ]
                        },
                        {
                            OR: mapSearch(input.filter, input.search)
                        },
                        ...CategoryStringToObject(categoryString.join(", ") !== "" ? categoryString.join(", ") : "[]")
                    ]
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
                select: {
                    CBH_Sample_ID: true
                }
            });

            const optionalEntries = await ctx.prisma.samples.findMany({
                where: {
                    CBH_Sample_ID: {
                        in: optionalUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? []
                    }
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
            })

            const mandatoryEntries = await ctx.prisma.samples.findMany({
                where: {
                    CBH_Sample_ID: {
                        in: mandatoryUniqueSampleIDs.map(item => item.CBH_Sample_ID?.toString() ?? "") ?? []
                    }
                },
                orderBy: {
                    CBH_Sample_ID: 'desc',
                },
            })

            const allEntriesWithOptionals: IOptionalSample[] = optionalEntries.map(e => {return {optional: true, data: e}})
            const mandatoryEntriesWithOptionals: IOptionalSample[] = mandatoryEntries.map(e => {return {optional: false, data: e}}) 

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
            category: z.string(),
            filter: NormalFilterSchema
        }))
        .query(async ({ctx, input}) => {
            let category: Categories[] = await ctx.prisma.categories.findMany({where: { mainCategory: input.category } })

            if(category === null || category.length === 0){
                category = await ctx.prisma.categories.findMany({where: { subCategory: input.category }})
            }

            const categoryString: string[] = []
            
            category.map((cat, i) => {
                const filter = cat.filter
                if(i !== category.length && category.length > 1){
                    filter?.slice(0, -1)

                }
                if(i !== 0){
                    filter?.slice(0, 1)
                }
                if(filter)
                    categoryString.push(filter)
            })
            
            const result = await ctx.prisma.samples.findMany({
                distinct: ['CBH_Sample_ID'],
                take: input.lines, 
                skip: (input.pages && input.lines) ? (input.pages -1) * input.lines : 0,
                where: {
                    AND: [...mapMandatory(input.filter, input.search), ...CategoryStringToObject(categoryString.join(", ") !== "" ? categoryString.join(", ") : "[]")]
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

                const entriesWithOptionals: IOptionalSample[] = entries.map(e =>{return {optional: true, data: e}}) 
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

                const allEntriesWithOptionals: IOptionalSample[] = optionalEntries.map(e => {return {optional: true, data: e}})
                const mandatoryEntriesWithoutOptionals: IOptionalSample[] = mandatoryEntries.map(e => {return {optional: false, data: e}}) 

                allEntriesWithOptionals.push(...mandatoryEntriesWithoutOptionals)

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
    return !(filter.ICD_Code.mandatory && filter.CBH_Donor_ID.mandatory && filter.CBH_Master_ID.mandatory && filter.CBH_Sample_ID.mandatory && filter.Diagnosis.mandatory && filter.Lab_Parameter.mandatory && filter.Matrix.mandatory && filter.Price.mandatory && filter.Quantity.mandatory && filter.Result_Interpretation.mandatory && filter.Result_Numerical.mandatory && filter.Result_Unit.mandatory)
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

function mapSearch(filter: INormalFilter, search: string | undefined): Prisma.SamplesWhereInput[] {
    const map: Prisma.SamplesWhereInput[] = []
    
    type SampleKey = keyof Samples
    type FilterKey = keyof INormalFilter
    
    Object.getOwnPropertyNames(filter).map((prop) => {
        if(Object.getOwnPropertyNames(SampleSchema.shape).find(item => item === prop)){
            if('value' in getProperty(filter, prop as FilterKey)){
                map.push({ 
                    [prop as SampleKey]: { 
                        contains: search, mode: 'insensitive' 
                    } 
                })
            }
        }
    })
    return map
}

function mapOptional(filter: INormalFilter, search: string | undefined) : Prisma.SamplesWhereInput[] {
    const map: Prisma.SamplesWhereInput[] = []

    type SampleKey = keyof Samples
    type FilterKey = keyof INormalFilter

    Object.getOwnPropertyNames(filter).map((prop) => {
        if(Object.getOwnPropertyNames(SampleSchema.shape).find(item => item === prop)){
            const filterProp = getProperty(filter, prop as FilterKey)

            if('value' in filterProp){
                if(Array.isArray(filterProp.value)){
                    map.push({
                        [prop as SampleKey]: { 
                            in: filterProp.value.length > 0 ? filterProp.value : undefined,
                            mode: 'insensitive'
                        }
                    })
                }
                else
                {
                    map.push({
                        [prop as SampleKey]: { 
                            contains: filterProp.value,
                            mode: 'insensitive'
                        }
                    })
                }
            }
            else if('min' in filterProp || 'max' in filterProp){
                map.push({
                    [prop as SampleKey]: {
                        lte: filterProp.max,
                        gte: filterProp.min
                    }
                })
            }
        }
    })

    map.push({ OR: mapSearch(filter, search) })

    return map
}

function mapMandatory(filter: INormalFilter, search: string | undefined) : Prisma.SamplesWhereInput[] {
    const map: Prisma.SamplesWhereInput[] = []

    type SampleKey = keyof Samples
    type FilterKey = keyof INormalFilter

    Object.getOwnPropertyNames(filter).map((prop) => {
        if(Object.getOwnPropertyNames(SampleSchema.shape).find(item => item === prop)){
            const filterProp = getProperty(filter, prop as FilterKey)

            if('value' in filterProp){
                if(Array.isArray(filterProp.value)){
                    map.push({
                        [prop as SampleKey]: { 
                            in: filterProp.mandatory && filterProp.value.length > 0 ? filterProp.value : undefined,
                            mode: 'insensitive'
                        }
                    })
                }
                else
                {
                    map.push({
                        [prop as SampleKey]: { 
                            contains: filterProp.mandatory ? filterProp.value : undefined,
                            mode: 'insensitive'
                        }
                    })
                }
            }
            else if('min' in filterProp || 'max' in filterProp){
                map.push({
                    [prop as SampleKey]: {
                        lte: filterProp.mandatory ? filterProp.max : undefined,
                        gte: filterProp.mandatory ? filterProp.min : undefined
                    }
                })
            }
        }
    })

    map.push({ OR: mapSearch(filter, search) })

    return map
}

function CategoryStringToObject(input: string): Prisma.SamplesWhereInput[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputObject = JSON.parse(input)
    const whereObject: Prisma.SamplesWhereInput[] = []

    type SampleKey = keyof Samples
    
    if(Array.isArray(inputObject)){
        inputObject.forEach((element: object) => {
            if(typeof element === "object" && !Array.isArray(element) && element !== null){
                
                Object.entries(element).map((objProp) => {
                    type NewProperty = {[key: string]: Prisma.StringNullableFilter | Prisma.IntNullableFilter | Prisma.FloatNullableFilter}
                    const newProperty: NewProperty = {}
                    
                    Object.entries(objProp[1] as object).map(prop => {

                        if(typeof prop[1] === "string" || (Array.isArray(prop[1]) && typeof prop[1][0] === "string")){
                            newProperty[prop[0]] = prop[1] as Prisma.StringNullableFilter
                            return
                        }

                        if(typeof prop[1] == "number" && Number.isInteger(prop[1])){
                            newProperty[prop[0]] = prop[1] as Prisma.IntNullableFilter
                            return
                        }

                        if(typeof prop[1] == "number" && !Number.isInteger(prop[1])){
                            newProperty[prop[0]] = prop[1] as Prisma.FloatNullableFilter
                            return
                        }
                    })

                    if(!Array.isArray(element) && element !== null && typeof objProp[1] === "object"){
                        whereObject.push({[objProp[0] as SampleKey]: newProperty} as Prisma.SamplesWhereInput)
                    }
                })
            }
        })
    }

    return whereObject
}