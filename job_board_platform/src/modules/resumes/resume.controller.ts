import { Request, Response } from "express";
import { UploadResume, getResumes } from "./resumes.service";

export async function UploadResumeController( req: AuthRequest, res: Response){
    try{
        const user = await req.user;
        if ( user.role !== "CANDIDATE"){ 
            return res.status(400).json({ 
                message: "Only candidates upload resumes",
            });
        }
        const body = req.file;
        const fileName = body.originalname;
        const fileUrl = `https://dummy-s3.com/${fileName}`;
        const newResume = await UploadResume(user.id, fileName, fileUrl);
        return res.status(200).json({
            success: true,
            data: newResume,
        });
    }catch{
        return res.status(500).json({
            success:false,
            message: "Error while uploading resume."
        });
    }
}
export async function getResumesController( req: AuthRequest, res: Response){
    try{
        const user = await req.user;
        const resumes = await getResumes( user.id);
        return res.status(200).json({sucess: true, data: resumes});
    }catch{
        return res.status(500).json({ message:"Error while getting resumes."});
    }
}
