import { Router } from "express";
import authenticateUser from "../lib/middleware/authenticate";
import { AuthController } from "./auth";
import ProposalController from "./proposal";
import ServerController from "./server";
import UserController from "./user";

const router = Router();

// -----  Public routes ------
router.use("/auth", AuthController);

// ---- Private routes ------
router.use(authenticateUser);
router.use("/user", UserController);
router.use("/server", ServerController);
router.use("/proposal", ProposalController);
export default router;
