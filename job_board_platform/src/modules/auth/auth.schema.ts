import { z } from "zod";
export const signupSchema = z.discriminatedUnion("role", [
    
    z.object({
        role: z.literal("CANDIDATE"),
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        headline: z.string().min(5),
    }),

    z.object({
        role: z.literal("EMPLOYER"),
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        companyName: z.string().min(1),
        companyDescription: z.string().min(5),
    }),

]);

export const loginSchema = z.object({
  email: z.string().email(),
  password; z.string().min(8),
});

export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
