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

export async function ApplyForJobs ( userId: string, jobId: string, resumeId: string){
    try{
        const application = await this.prisma.application.create({
            data:{
                jobId,
                candidateId: userId,
                resumeId,
            }, select:{
                status: true,
                appliedAt: true,
                resumeId: true,
            }
        });
        return application;
    } catch{
        throw new Error("Internal server error");
    }
}

export async function trackApplication( userId: string, jobId: string){
    try{
        const application = await this.prisma.application.findUnique({
            where: { candidateId: userId, jobId,},
            select: { status: true, resumeId: true, appliedAt: true },
        });
        return application;
    }catch{
        throw new Error("Internal server error");
    }
}

export async function getApplications( userId: string, skip=0){
    try{
        const applications = await this.prisma.application.findMany({
            take: 10,
            skip,
            where: { candidateId: userId },
            orderBy: { appliedAt: "desc"},
        });
        return applicationsl
    }catch{
        throw new Error("Internal server error");
    }
}

export async function getApplicants( jobId: string, skip = 0){
    try{
        const applications = await this.prisma.application.findMany({
            take: 10,
            skip,
            where: { jobId},
            orderBy: { appliedAt: "desc"},
        });
        return applications;
    }catch{
        throw new Error("Internal server error");
    }
}

export async function acceptApplication( jobId: string, userId: string, applicationId: string){
    try{
        const application = await this.prisma.$queryRaw`
            UPDATE "Application" AS a 
            SET "status" = 'ACCEPTED'
            FROM "JobListing" AS j
            WHERE a."jobId" = j."id"
                AND j."employerId" = ${userId}
                AND a."jobId" = ${jobId};
            `;
        if (!application){ throw new NotFoundError("No application was found");}
        return application;
    }catch{
        throw new Error("Server error");
    }
}

export async function rejectApplication( jobId: string, userId: string, applicationId: string){
    try{
        const application = await this.prisma.$queryRaw`
            UPDATE "Application" AS a 
            SET "status" = 'REJECTED'
            FROM "JobListing" AS j
            WHERE a."jobId" = j."id"
                AND j."employerId" = ${userId}
                AND a."jobId" = ${jobId};
            `;
        if (!application){ throw new NotFoundError("No application was found");}
        return application;
    }catch{
        throw new Error("Server error");
    }
}
