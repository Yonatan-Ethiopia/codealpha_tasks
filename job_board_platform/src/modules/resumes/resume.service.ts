import { prisma } from "../../../prisma/client";
import { UploadResumeData } from "./resumes.schema";

export async function UploadResume( userId: string, data: UploadResumeData){
    try:{
        return await prisma.$transcation( async (tx)=>{
            const newResume = await tx.resume.create({
                data: {
                    candidateId: userId,
                    ...data,
                },
                select:{
                    fileName: true,
                    uploadedAt: true,
                }
            });
            return { success: true, data: newResume };
        });
    }catch{
        throw new Error("Resume couldn't be uploaded.");
    }
}

export async function getResumes( userId: string ){
    try:{
        return await prisma.$transcation( async (tx)=>{
            const resumes = await tx.resume.findMany({
                where: { id: userId, },
                select: { fileName: true, uploadedAt: true },
                orderBy:{ date: "desc" },
            });
            return {success: true, data: resumes}
        });
    }catch{
        throw new Error("Couldn't get resumes.");
    }
}
