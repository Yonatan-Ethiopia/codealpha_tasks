import { Request, Response } from "express";
import { signupSchema } from "./auth.schema";
import { registerUser } from "./auth.service";
import { ConflictError} from "./errors/AppError.js";
export async function signupController( req: Request, res: Response){
    const result = await signupSchema.safeParse(req.body);

    if( !result.success ){
        return res.status(400).json({
            error: result.error.flatten(),
        });
    }
   try{
    const user = await registerUser(result.data);

    return res.status(201).json(user);
   }
   catch(error){
      if (error instanceof ConflictError){
          return res.status(409).json({
              error: error.message,
          });
      }
       return res.status(500).json({
           error: "Internal server error",
       });
   }
}
