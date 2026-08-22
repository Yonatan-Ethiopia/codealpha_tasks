import express, { Request, Response} from "express";
import prisma from "./prisma/client.js";
import { ConflictError } from "./errors/AppError.js";

async function registerUser(input: { name: string; email: string; password: string; role: RoleEnum}){

    try {
        const emailExists = await prisma.user.findUnique({ where: { email:input. email});
        if (emailExists){

            throw new ConflictError("Email already exists");
                
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        

    }    

}
