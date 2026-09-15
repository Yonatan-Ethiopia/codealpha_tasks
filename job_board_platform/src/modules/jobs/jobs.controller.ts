import { Request, Response} from "express";
import { CreateJobSchema, CreateJobData, GetJobsSchema, GetJobsData } from "./jobs.schema";
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
export async function GetJobsController( req: AuthRequest, res: Response){
    const data = await GetJobsSchema.safeParse(req.body);
    if (!data.success){
        return res.status(400).json({
            error: result.error.flatten(),
        });
    }
    try{
        const jobs = await GetJobs( data );
        return res.status(201).json(jobs);
    } catch(console.error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server error",
        });
    }
}
 export async function ApplyForJonsController( req: AuthRequest, res: Response){
     const data = await ApplyForJobsSchema.safeParse(req.body);
    if(!data.success){ 
        return res.status(400).json({
            error: result.error.flatten(),
        });
    }
     try{
         const user = req.user;
         const application = await ApplyForJobs(user.id, data.jobId, data.resumeId);
         return res.status(200).json(application);
     } catch(error){
         console.log(error);
         return res.status(500).json({
             message:"Internal server error"
         });
     }
 }

 export async function TrackApplicationController( req: AuthRequest, res: Response){
     try{
         const user = req.user;
         const { jobId } = req.params;
         const application = await trackApplication(user.Id,jobId);
         return res.status(200).json(application);
     }catch(error){
         console.log(error);
         return res.status(500).json({
             message: "Internal server error"
         });
     }
 }

 export async function GetApplications( req: AuthRequest, res: Response){
     try{
         const user = req.user;
         const skip = Number(req.query.skip) || 0;
         const applications = await getApplications(user.id, skip);
         return res.status(200).json(applications)
     }catch(error){
         console.log(error);
         return res.status(500).json({
             message:"Internal server error"
         });
     }
 }

 export async function GetApplicantsController( req: AuthRequest, res: Response){
     try{
         const user = req.user;
         const { jobId } = req.params; 
         const skip = Number(req.query.skip) || 0;
         const applicants = await getApplicants( user.id, jobId, skip );
         return res.status(200).json(applicants);
     }catch(error){
         console.log(error);
         return res.status(500).json({
             message:"Internal server error"
         });
     }
 }

 export async function AcceptApplicationController( req: AuthRequest, res: Response){
     try{
         const user = req.user;
         const data = await AcceptApplicationSchema.safeParse(req.body);
         const application = await acceptApplication( data.jobId, user.id, data.applicationId);
         return res.status(200).json(application);
     }catch(error){
         console.log(error);
         return res.status(500).json({
             message: "Internal server error"
         });
     }
 }

 export async function rejectApplication( jobId: string, userId: string, applicationId: string){
     try{
         const user = req.user;
         const data = await AcceptApplicationSchema.safeParse(req.body);
         const application = await rejectApplication( data.jobId, user.id, data.applicationId);
         return res.status(200).json({
             message:"Internal server error"
         });
     }
 }
