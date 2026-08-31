import { Request, Response} from "express";
import { CreateJobSchema } from "./jobs.schema";
import { CreateJob } from "./jobs.service";

export async function CreateJobController( req: AuthRequest, res: Response){
    const data = await CreateJobSchema.safeParse(req.body);
    if (!data.success){
        return res.status(400).json({
            error: result.error.flatten(),
        });
    }
    try{
        const user = await req.user;
        if (user.role !== "EMPLOYER"){
            return res.status(401).json({
                message: "Candidate cannot post jobs",
            });
        }
        const newJob = await CreateJob(user.id, data);
        return res.status(201).json(newJob);
    } catch(error) {
        if (error){
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}
