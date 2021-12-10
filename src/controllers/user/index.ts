import { Request, Response, Router } from "express";
import DiscordClient from "../../client/discord_client";
import BackendError from "../../exceptions/backend_error";
import DiscordService from "../../service/discord_service";
import UserService from "../../service/user_service";
import UserView from "../../views/UserView";

const router = Router();

const userService = new UserService();
const discordService = new DiscordService(new DiscordClient());

const UserController = router
  .get(
    "/",
    async (
      req: Request<unknown, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        const user = await userService.getOneById(req.query.id);

        return res.json({ ...UserView.fromUser(user) });
      } catch (err) {
        if (err instanceof BackendError) {
          return res.status(err.httpStatusCode).json({ err: err.name });
        } else {
          console.error(err);
          return res.status(500).json({ err: "Something went wrong" });
        }
      }
    }
  )
  .get(
    "/guilds",
    async (
      req: Request<unknown, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        const user = await userService.getOneById(req.query.id);
        const guilds = await discordService.getUserGuilds(
          user.access_token,
          user.id
        );
        return res.json({ ...UserView.fromUser(user), guilds });
      } catch (err) {
        if (err instanceof BackendError) {
          return res.status(err.httpStatusCode).json({ err: err.name });
        } else {
          console.error(err);
          return res.status(500).json({ err: "Something went wrong" });
        }
      }
    }
  );
export default UserController;
