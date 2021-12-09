import { Request, Response, Router } from "express";

const router = Router();

const UserController = router
  .get(
    "/:id",
    async (
      req: Request<{ id: string }, unknown, unknown, unknown>,
      res: Response
    ) => {
      res.json({ message: "hi" });
    }
  )
  .get(
    "/:id/guilds",
    async (
      req: Request<{ id: string }, unknown, unknown, unknown>,
      res: Response
    ) => {
      res.json({ message: "hi" });
    }
  );
export default UserController;
