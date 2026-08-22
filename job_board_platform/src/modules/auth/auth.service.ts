import express, { Request, Response} from "express";
import prisma from "./prisma/client.js";
import { ConflictError } from "./errors/AppError.js";
import { signupSchema, SignupData } from "./auth.schema.ts";
async function registerUser(input: SignupData ){

        const emailExists = await prisma.user.findUnique({ where: { email:input. email});
        if (emailExists){

            throw new ConflictError("Email already exists");
                
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const newUser = await prisma.user.create({
            data: {
                name: input.name,
                email: input.email,
                password: hashPassword,
                role: input.RoleEnum
            },
          })
         
        if(role == "EMPLOYER"){
            const newEmployer = await prisma.employer.create({
                data: {
                    userId: newUser.id,
                    companyName: input.companyName,
                    companyDescription: input.companyDescription,
                },
            })
        }
        if (role == "CANDIDATE"){
            const newCandidate = await prisma.candidate.create({
                data: {
                    userId: newUser.id,
                    headline: input.headline,
                },
             })
        }

    })

}
