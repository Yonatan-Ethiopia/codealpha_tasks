import { prisma } from "../../../prisma/client";
import { ConflictError, NotFoundError, MisMatchError} from "../../errors/AppError";
import { CreateJobData, GetJobsData } from "./jobs.schema";

export async function CreateJob( userId: string, data: CreateJobData){
    return await prisma.$transcation( async (tx)=>{
        const newJob = await tx.user.create({
            employerId: userId,
            data,
        });
    })
}

export async function GetJobs( where: GetJobsData, orderBy: string,skip: number){
    return await prisma.$transcation( async (tx)=>{
        const jobs = await tx.user.findMany({
            take: 10,
            skip,
            orderBy,
            where,
        });
    })
}
