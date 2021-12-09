import { Router } from "express";
import { AuthController } from "./auth";
import UserController from "./user";

const router = Router();

router.use("/auth", AuthController);
router.use("/user", UserController);
export default router;
