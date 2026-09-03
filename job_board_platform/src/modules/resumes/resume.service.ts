import { prisma } from "../../../prisma/client";

export async function UploadResume( userId: string, fileName: string, fileUrl: string){
    try{
        return await prisma.$transcation( async (tx)=>{
            const newResume = await tx.resume.create({
                data: {
                    candidateId: userId,
                    fileName,
                    fileUrl,
                },
                select:{
                    fileName: true,
                    uploadedAt: true,
                }
            });
            return newResume;
        });
    }catch{
        throw new Error("Resume couldn't be uploaded.");
    }
}

export async function getResumes( userId: string ){
    try{
        return await prisma.$transcation( async (tx)=>{
            const resumes = await tx.resume.findMany({
                where: { id: userId, },
                select: { fileName: true, uploadedAt: true },
                orderBy:{ date: "desc" },
            });
            return resumes;
        });
    }catch{
        throw new Error("Couldn't get resumes.");
    }
}
