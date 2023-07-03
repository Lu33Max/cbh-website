import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { CategoriesSchema } from "~/common/database/categories";
import { Prisma, type Samples } from "@prisma/client";

export const categoriesRouter = createTRPCRouter ({

    //Create
    create: publicProcedure
        .input(CategoriesSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.categories.create({ data: input })
        }),

    createMany: publicProcedure
        .input(CategoriesSchema.array())
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.categories.createMany({ data: input })
        }),

    //Read
    getMany: publicProcedure
        .input(z.object({take: z.number(), skip: z.number()}))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.categories.findMany({
                take: input.take,
                skip: input.skip
            })
        }),

    getAll: publicProcedure
        .input(z.object({category: z.string().optional()}))
        .query(async ({ ctx, input }) => {
            if (!input.category) {
                return ctx.prisma.categories.findMany()
            }

            switch(input.category) {
                case "Pregnancy":                        
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Diagnosis: {
                                        contains: "pregnant"
                                    },
                                },
                                {
                                    Pregnancy_Week: {
                                        gte: 1,
                                        lte: 40
                                    }
                                }
                            ]
                        }
                    })
                case "infectiousDiseases": 
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Hepatitis B surface antigen HBsAg", "Hepatitis B Core HBc", "Hepatitis B Virus HBsAg", "anti-Hepatitis B excretory Antigen HBe", "anti-Hepatitis B surface Antigen HBs", "anti-Hepatitis B core antigen HBc", "Hepatitis E Virus ribonucleic acid HEV RNA", "anti-Hepatitis E Virus HEV IgG", "anti-Hepatitis D virus HDV", "Hepatitis C Virus ribonucleic acid HCV-RNA", "Hepatitis C virus HCV RNA", "Hepatitis C Virus deoxyribonucleic acid HCV-DNA", "Hepatitis C Virus HCV Antigen", "Hepatitis C Virus HCV", "Hepatitis C Virus Anti-HCV", "anti-Hepatitis C Virus HCV IgG. IgM", "anti-Hepatitis C Virus HCV IgG", "anti-Hepatitis C Virus HCV", "anti-Hepatitis C Virus HCV Index", "Hepatitis B Virus HBV DNA", "Hepatitis B Virus deoxyribonucleic acid HBV-DNA", "Hepatitis B Virus HBV", "Hepatitis B Virus HBV HBEA", "Hepatitis A Virus ribonucleic acid HAV-RNA", "anti-Hepatitis A Virus HAV IgM", "anti-Hepatitis A Virus HAV", "anti-Hepatitis A Virus HAV IgG, anti-Influenza A virus IgM", "Influenza A IgM INFZ A-M", "Influenza A IgG", "anti-Influenza B Virus IgG", "Influenza B IgG INFZ B-G, Candidal sepsis", "Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified", "Infuenza A Virus", "Influenza A Virus"]
                                    }
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positve","reactive"],
                                        mode: 'insensitive',
                                    }
                                },
                                {
                                    ICD_Code: {
                                        in: ["Candidal sepsis","Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "infectiousDiseases": 
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Chlamydia pneumoniae IgM","Chlamydia pneumoniae IgG", " anti-Chlamydia trachomatis IgM", "anti-Chlamydia pneumoniae IgG", "anti-Chlamydia trachomatis IgG", "anti-Chlamydia pneumoniae IgA" , "anti-Chlamydia trachomatis IgA", "Human Immunodeficiency Virus deoxyribonucleic acid HIV-DNA","Human Immunodeficiency Virus type 1 ribonucleic acid HIV-1-RNA", "Human Immunodeficiency Virus ribonucleic acid HIV-RNA", "Human Immunodeficiency Virus 1 HIV-1 p24 Ag", "Human Immunodeficiency Virus 1 HIV-1 GT", "Human Immunodeficiency Virus HIV-1 P24 Ab", "Human Immunodeficiency Virus 1 HIV-1 TITER", "Human Immunodeficiency Virus HIV Ab/Ag", "Human Immunodeficiency Virus HIV 1/2 Ab/Ag", "Human Immunodeficiency Virus HIV", "anti-Human Immunodeficiency Virus p24 HIV p24", "anti-Human Immunodeficiency Virus-1/2 HIV-1/2", "Syphilis SYPH", "Syphilis Treponema pallidum", "anti-Syphilis Treponema pallidum IgM", "anti-Syphilis Treponema pallidum IgG", "anti-Syphilis Treponema pallidum"],
                                    }
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positve","reactive"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "1stTrimester":                        
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Diagnosis: {
                                        contains: "pregnant"
                                    },
                                },
                                {
                                    Pregnancy_Week: {
                                        gte: 1,
                                        lte: 12
                                    }
                                }
                            ]
                        }
                    })
                case "2ndTrimester":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Diagnosis: {
                                        contains: "pregnant"
                                    },
                                },
                                {
                                    Pregnancy_Week: {
                                        gte: 13,
                                        lte: 24
                                    }
                                }
                            ]
                        }
                    })
                case "3rdTrimester":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Diagnosis: {
                                        contains: "pregnant"
                                    },
                                },
                                {
                                    Pregnancy_Week: {
                                        gte: 25,
                                        lte: 40
                                    }
                                }
                            ]
                        }
                    })
                case "hepatits":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Hepatitis B surface antigen HBsAg", "Hepatitis B Core HBc", "Hepatitis B Virus HBsAg", "anti-Hepatitis B excretory Antigen HBe", "anti-Hepatitis B surface Antigen HBs", "anti-Hepatitis B core antigen HBc", "Hepatitis E Virus ribonucleic acid HEV RNA", "anti-Hepatitis E Virus HEV IgG", "anti-Hepatitis D virus HDV", "Hepatitis C Virus ribonucleic acid HCV-RNA", "Hepatitis C virus HCV RNA", "Hepatitis C Virus deoxyribonucleic acid HCV-DNA", "Hepatitis C Virus HCV Antigen", "Hepatitis C Virus HCV", "Hepatitis C Virus Anti-HCV", "anti-Hepatitis C Virus HCV IgG. IgM", "anti-Hepatitis C Virus HCV IgG", "anti-Hepatitis C Virus HCV", "anti-Hepatitis C Virus HCV Index", "Hepatitis B Virus HBV DNA", "Hepatitis B Virus deoxyribonucleic acid HBV-DNA", "Hepatitis B Virus HBV", "Hepatitis B Virus HBV HBEA", "Hepatitis A Virus ribonucleic acid HAV-RNA", "anti-Hepatitis A Virus HAV IgM", "anti-Hepatitis A Virus HAV", "anti-Hepatitis A Virus HAV IgG"],
                                        mode: 'insensitive',
                                    }
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positve","reactive"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "influenza":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["anti-Influenza A virus IgM", "Influenza A IgM INFZ A-M", "Influenza A IgG", "anti-Influenza B Virus IgG", "Influenza B IgG INFZ B-G"],
                                        mode: 'insensitive',
                                    }
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positve"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "sepsis":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    ICD_Code: {
                                        in: ["Candidal sepsis","Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "influenza_a_swabs":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Infuenza A Virus", "Influenza A Virus"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                case "chlamydia":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Chlamydia pneumoniae IgM","Chlamydia pneumoniae IgG", " anti-Chlamydia trachomatis IgM", "anti-Chlamydia pneumoniae IgG", "anti-Chlamydia trachomatis IgG", "anti-Chlamydia pneumoniae IgA" , "anti-Chlamydia trachomatis IgA"],
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positive"],
                                        mode: 'insensitive', 
                                    }
                                }
                            ]
                        }
                    })
                case "hiv":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Human Immunodeficiency Virus deoxyribonucleic acid HIV-DNA","Human Immunodeficiency Virus type 1 ribonucleic acid HIV-1-RNA", "Human Immunodeficiency Virus ribonucleic acid HIV-RNA", "Human Immunodeficiency Virus 1 HIV-1 p24 Ag", "Human Immunodeficiency Virus 1 HIV-1 GT", "Human Immunodeficiency Virus HIV-1 P24 Ab", "Human Immunodeficiency Virus 1 HIV-1 TITER", "Human Immunodeficiency Virus HIV Ab/Ag", "Human Immunodeficiency Virus HIV 1/2 Ab/Ag", "Human Immunodeficiency Virus HIV", "anti-Human Immunodeficiency Virus p24 HIV p24", "anti-Human Immunodeficiency Virus-1/2 HIV-1/2"],
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positive, reactive"],
                                        mode: 'insensitive', 
                                    }
                                }
                            ]
                        }
                    })
                case "syphilis":
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Syphilis SYPH", "Syphilis Treponema pallidum", "anti-Syphilis Treponema pallidum IgM", "anti-Syphilis Treponema pallidum IgG", "anti-Syphilis Treponema pallidum"],
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positive, reactive"],
                                        mode: 'insensitive', 
                                    }
                                }
                            ]
                        }
                    })
            }
        }),

    getFilteredResults: publicProcedure
        .input(z.object({ mainCategory: z.string().optional(), subCategory: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            if (input.mainCategory != undefined && input.mainCategory != null) {

                switch(input.mainCategory) {
                    case "pregnancy":                        
                        const test = [
                                    {
                                        Diagnosis: {
                                            contains: "pregnant"
                                        },
                                    },
                                    {
                                        Pregnancy_Week: {
                                            gte: 1,
                                        }
                                    }
                                ]
                                console.log(JSON.stringify(test))
                                return test
                    case "infectiousDiseases":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Hepatitis B surface antigen HBsAg", "Hepatitis B Core HBc", "Hepatitis B Virus HBsAg", "anti-Hepatitis B excretory Antigen HBe", "anti-Hepatitis B surface Antigen HBs", "anti-Hepatitis B core antigen HBc", "Hepatitis E Virus ribonucleic acid HEV RNA", "anti-Hepatitis E Virus HEV IgG", "anti-Hepatitis D virus HDV", "Hepatitis C Virus ribonucleic acid HCV-RNA", "Hepatitis C virus HCV RNA", "Hepatitis C Virus deoxyribonucleic acid HCV-DNA", "Hepatitis C Virus HCV Antigen", "Hepatitis C Virus HCV", "Hepatitis C Virus Anti-HCV", "anti-Hepatitis C Virus HCV IgG. IgM", "anti-Hepatitis C Virus HCV IgG", "anti-Hepatitis C Virus HCV", "anti-Hepatitis C Virus HCV Index", "Hepatitis B Virus HBV DNA", "Hepatitis B Virus deoxyribonucleic acid HBV-DNA", "Hepatitis B Virus HBV", "Hepatitis B Virus HBV HBEA", "Hepatitis A Virus ribonucleic acid HAV-RNA", "anti-Hepatitis A Virus HAV IgM", "anti-Hepatitis A Virus HAV", "anti-Hepatitis A Virus HAV IgG, anti-Influenza A virus IgM", "Influenza A IgM INFZ A-M", "Influenza A IgG", "anti-Influenza B Virus IgG", "Influenza B IgG INFZ B-G, Candidal sepsis", "Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified", "Infuenza A Virus", "Influenza A Virus"]
                                        }
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positve","reactive"],
                                            mode: 'insensitive',
                                        }
                                    },
                                    {
                                        ICD_Code: {
                                            in: ["Candidal sepsis","Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified"],
                                            mode: 'insensitive',
                                        }
                                    }
                                ]
                            }
                        })
                    case "infectiousDiseases": 
                    return ctx.prisma.samples.findMany({
                        where: {
                            AND: [
                                {
                                    Lab_Parameter: {
                                        in: ["Chlamydia pneumoniae IgM","Chlamydia pneumoniae IgG", " anti-Chlamydia trachomatis IgM", "anti-Chlamydia pneumoniae IgG", "anti-Chlamydia trachomatis IgG", "anti-Chlamydia pneumoniae IgA" , "anti-Chlamydia trachomatis IgA", "Human Immunodeficiency Virus deoxyribonucleic acid HIV-DNA","Human Immunodeficiency Virus type 1 ribonucleic acid HIV-1-RNA", "Human Immunodeficiency Virus ribonucleic acid HIV-RNA", "Human Immunodeficiency Virus 1 HIV-1 p24 Ag", "Human Immunodeficiency Virus 1 HIV-1 GT", "Human Immunodeficiency Virus HIV-1 P24 Ab", "Human Immunodeficiency Virus 1 HIV-1 TITER", "Human Immunodeficiency Virus HIV Ab/Ag", "Human Immunodeficiency Virus HIV 1/2 Ab/Ag", "Human Immunodeficiency Virus HIV", "anti-Human Immunodeficiency Virus p24 HIV p24", "anti-Human Immunodeficiency Virus-1/2 HIV-1/2", "Syphilis SYPH", "Syphilis Treponema pallidum", "anti-Syphilis Treponema pallidum IgM", "anti-Syphilis Treponema pallidum IgG", "anti-Syphilis Treponema pallidum"],
                                    }
                                },
                                {
                                    Result_Interpretation: {
                                        in: ["positve","reactive"],
                                        mode: 'insensitive',
                                    }
                                }
                            ]
                        }
                    })
                }
            } else {
                switch(input.subCategory) {
                    case "1stTrimester":                        
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Diagnosis: {
                                            contains: "pregnant"
                                        },
                                    },
                                    {
                                        Pregnancy_Week: {
                                            gte: 1,
                                            lte: 12
                                        }
                                    }
                                ]
                            }
                        })
                    case "2ndTrimester":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Diagnosis: {
                                            contains: "pregnant"
                                        },
                                    },
                                    {
                                        Pregnancy_Week: {
                                            gte: 13,
                                            lte: 24
                                        }
                                    }
                                ]
                            }
                        })
                    case "3rdTrimester":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Diagnosis: {
                                            contains: "pregnant"
                                        },
                                    },
                                    {
                                        Pregnancy_Week: {
                                            gte: 25,
                                            lte: 40
                                        }
                                    }
                                ]
                            }
                        })
                    case "hepatits":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Hepatitis B surface antigen HBsAg", "Hepatitis B Core HBc", "Hepatitis B Virus HBsAg", "anti-Hepatitis B excretory Antigen HBe", "anti-Hepatitis B surface Antigen HBs", "anti-Hepatitis B core antigen HBc", "Hepatitis E Virus ribonucleic acid HEV RNA", "anti-Hepatitis E Virus HEV IgG", "anti-Hepatitis D virus HDV", "Hepatitis C Virus ribonucleic acid HCV-RNA", "Hepatitis C virus HCV RNA", "Hepatitis C Virus deoxyribonucleic acid HCV-DNA", "Hepatitis C Virus HCV Antigen", "Hepatitis C Virus HCV", "Hepatitis C Virus Anti-HCV", "anti-Hepatitis C Virus HCV IgG. IgM", "anti-Hepatitis C Virus HCV IgG", "anti-Hepatitis C Virus HCV", "anti-Hepatitis C Virus HCV Index", "Hepatitis B Virus HBV DNA", "Hepatitis B Virus deoxyribonucleic acid HBV-DNA", "Hepatitis B Virus HBV", "Hepatitis B Virus HBV HBEA", "Hepatitis A Virus ribonucleic acid HAV-RNA", "anti-Hepatitis A Virus HAV IgM", "anti-Hepatitis A Virus HAV", "anti-Hepatitis A Virus HAV IgG"],
                                            mode: 'insensitive',
                                        }
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positve","reactive"],
                                            mode: 'insensitive',
                                        }
                                    }
                                ]
                            }
                        })
                    case "influenza":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["anti-Influenza A virus IgM", "Influenza A IgM INFZ A-M", "Influenza A IgG", "anti-Influenza B Virus IgG", "Influenza B IgG INFZ B-G"],
                                            mode: 'insensitive',
                                        }
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positve"],
                                            mode: 'insensitive',
                                        }
                                    }
                                ]
                            }
                        })
                    case "sepsis":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        ICD_Code: {
                                            in: ["Candidal sepsis","Other streptococcal sepsis", "Salmonella sepsis", "Sepsis due to Escherichia coli [E. coli]", "Sepsis due to other specified staphylococcus", "Sepsis due to Pseudomonas", "Sepsis due to Streptococcus pneumoniae", "Sepsis due to streptococcus", "group A", "Sepsis due to streptococcus", "group B", "Sepsis", "unspecified organism", "Streptococcal sepsis", "unspecified"],
                                            mode: 'insensitive',
                                        }
                                    }
                                ]
                            }
                        })
                    case "influenza_a_swabs":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Infuenza A Virus", "Influenza A Virus"],
                                            mode: 'insensitive',
                                        }
                                    }
                                ]
                            }
                        })
                    case "chlamydia":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Chlamydia pneumoniae IgM","Chlamydia pneumoniae IgG", " anti-Chlamydia trachomatis IgM", "anti-Chlamydia pneumoniae IgG", "anti-Chlamydia trachomatis IgG", "anti-Chlamydia pneumoniae IgA" , "anti-Chlamydia trachomatis IgA"],
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positive"],
                                            mode: 'insensitive', 
                                        }
                                    }
                                ]
                            }
                        })
                    case "hiv":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Human Immunodeficiency Virus deoxyribonucleic acid HIV-DNA","Human Immunodeficiency Virus type 1 ribonucleic acid HIV-1-RNA", "Human Immunodeficiency Virus ribonucleic acid HIV-RNA", "Human Immunodeficiency Virus 1 HIV-1 p24 Ag", "Human Immunodeficiency Virus 1 HIV-1 GT", "Human Immunodeficiency Virus HIV-1 P24 Ab", "Human Immunodeficiency Virus 1 HIV-1 TITER", "Human Immunodeficiency Virus HIV Ab/Ag", "Human Immunodeficiency Virus HIV 1/2 Ab/Ag", "Human Immunodeficiency Virus HIV", "anti-Human Immunodeficiency Virus p24 HIV p24", "anti-Human Immunodeficiency Virus-1/2 HIV-1/2"],
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positive, reactive"],
                                            mode: 'insensitive', 
                                        }
                                    }
                                ]
                            }
                        })
                    case "syphilis":
                        return ctx.prisma.samples.findMany({
                            where: {
                                AND: [
                                    {
                                        Lab_Parameter: {
                                            in: ["Syphilis SYPH", "Syphilis Treponema pallidum", "anti-Syphilis Treponema pallidum IgM", "anti-Syphilis Treponema pallidum IgG", "anti-Syphilis Treponema pallidum"],
                                            mode: 'insensitive',
                                        },
                                    },
                                    {
                                        Result_Interpretation: {
                                            in: ["positive, reactive"],
                                            mode: 'insensitive', 
                                        }
                                    }
                                ]
                            }
                        })
                }
            }
            return ctx.prisma.categories.findMany()
        }),
})