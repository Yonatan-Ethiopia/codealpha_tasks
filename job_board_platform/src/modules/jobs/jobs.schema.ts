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
