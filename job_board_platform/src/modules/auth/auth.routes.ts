import { Router } from "express";
import { signupController } from "./auth.controller";

const router = Router();

router.post( "/register", signupController);
export default router;
