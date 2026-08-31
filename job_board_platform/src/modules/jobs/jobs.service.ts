import { prisma } from "../../../prisma/client";
import { ConflictError, NotFoundError, MisMatchError} from "../../errors/AppError";
import { CreateJobData } from "./jobs.schema";

export async function CreateJob( userId: string, data: CreateJobData){
    return await prisma.$transcation( async (tx)=>{
        const newJob = await tx.user.create({
            employerId: userId,
            data,
        });
    })
}
