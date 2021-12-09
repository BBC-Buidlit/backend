import { Router } from "express";
import authenticateUser from "../lib/middleware/authenticate";
import { AuthController } from "./auth";
import UserController from "./user";

const router = Router();

// -----  Public routes ------
router.use("/auth", AuthController);

// ---- Private routes ------
router.use(authenticateUser);
router.use("/user", UserController);
export default router;
