import { z } from "zod";

export const CreateJobSchema = z.object({
    title: z.string().min(3, "Title needs to be atleast 3 characters"),
    description: z.string().min(5, "description needs to be atleast 5 chararcters"),
    location: z.string().min(2, "Location needs to be atleast 2 characters"),
    type: z.enum(["REMOTE", "FULLTIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]),
    salaryMin: z.number().isFinite().nonnegative().optional(),
    salaryMax: z.number().isFinite().nonnegative().optional(),
});
export type CreateJobData = z.infer<typeof CreateJobSchema>;

export const GetJobsSchema = z.object({
    skip: z.coerce.number().optional().default(0),
    orderBy: z.object({
        createdAt:z.enum(["desc", "asc"]).optional().default("desc"), 
    }),
    where: z.object({
        skip: z.coerce.number().optional().default(0),
        title: z.string().optional(),
        location: z.string().optional(),
        type: z.enum(["REMOTE", "FULLTIME", "CONTRACT", "INTERNSHIP"]),
        salaryMin: z.object({
            gte: z.number().optional(),
        }).optional(),
        salaryMax: z.object({
            lte: z.number().optional(),
        }).optional(),
    }),

})
export type GetJobsData = z.infer<typeof GetJobsSchema>["where"];
