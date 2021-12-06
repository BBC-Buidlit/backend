import { Router } from "express";
import { AuthController } from "./auth/auth";


const router = Router();

router.use("/auth", AuthController);


export default router;