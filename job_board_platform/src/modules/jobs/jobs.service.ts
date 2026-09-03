import { prisma } from "../../../prisma/client";
import { ConflictError, NotFoundError, MisMatchError} from "../../errors/AppError";
import { CreateJobData, GetJobsData } from "./jobs.schema";

export async function CreateJob( userId: string, data: CreateJobData){
    try:{
        return await prisma.$transcation( async (tx)=>{
            const newJob = await tx.user.create({
                data:{
                    employerId: userId,
                    ...data,
                }
            });
            return { success: true, data: { title: newJob.title, description: newJob.description, location: newJob.location, type: newJob.type, salaryMax: newJob.salaryMax, salaryMin: newJob.salaryMin, status: newJob.status }}
        });
    } catch{
        throw new Error("Job couldn't be created.");
    }
}

export async function GetJobs( where: GetJobsData, orderBy: string,skip: number){
    return await prisma.$transcation( async (tx)=>{
        const jobs = await tx.user.findMany({
            take: 10,
            skip,
            orderBy,
            where,
            select:{
                title: true,
                description: true,
                location: true,
                type: true,
                salaryMin: true,
                salaryMax: true,
                status: true,
                createdAt: true,
            }
        });
        return { success: true, data: jobs }
    })
}
