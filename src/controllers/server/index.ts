import { Request, Response, Router } from "express";
import DiscordClient from "../../client/discord_client";
import BackendError from "../../exceptions/backend_error";
import DiscordService from "../../service/discord_service";
import ServerService from "../../service/server_service";
import UserService from "../../service/user_service";
import ServerView from "../../views/ServerView";
import UserView from "../../views/UserView";

const router = Router();

const discordService = new DiscordService(new DiscordClient());
const serverService = new ServerService(discordService);
const userService = new UserService();

const ServerController = router
  .get(
    "/",
    async (
      req: Request<unknown, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        const user = await userService.getOneById(req.query.id);
        const guilds = await serverService.getConnectedServers(
          user.access_token,
          user._id
        );
        return res.json({
          ...UserView.fromUser(user),
          guilds: guilds.map((guild) =>
            ServerView.fromServer({
              _id: guild._id,
              name: guild.name,
              discord_id: guild.discord_id,
              owner_id: guild.owner_id,
              icon: guild.icon,
            })
          ),
        });
      } catch (err) {
        if (err instanceof BackendError) {
          return res
            .status(err.httpStatusCode)
            .json({ message: `${err.name} : ${err.message}` });
        } else {
          console.error(err);
          return res.status(500).json({ message: "Something went wrong" });
        }
      }
    }
  )
  .get(
    "/discord_owned",
    async (
      req: Request<unknown, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        const user = await userService.getOneById(req.query.id);
        const guilds = await serverService.getGuildsWhereUserIsOwner(
          user.access_token,
          user
        );
        return res.json({
          ...UserView.fromUser(user),
          guilds: guilds.map((guild) =>
            ServerView.fromServer({
              _id: "",
              name: guild.name,
              discord_id: guild.id,
              owner_id: user._id,

              icon: guild.icon,
            })
          ),
        });
      } catch (err) {
        if (err instanceof BackendError) {
          return res
            .status(err.httpStatusCode)
            .json({ message: `${err.name} : ${err.message}` });
        } else {
          console.error(err);
          return res.status(500).json({ message: "Something went wrong" });
        }
      }
    }
  )
  .post(
    "/import/:id",
    async (
      req: Request<{ id: string }, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        // get discord server and check if user is owner of it and then import
        const user = await userService.getOneById(req.query.id);

        const server = await serverService.importFromDiscordServer(
          req.params.id,
          user
        );

        return res.json({ message: server });
      } catch (err) {
        if (err instanceof BackendError) {
          return res
            .status(err.httpStatusCode)
            .json({ message: `${err.name} : ${err.message}` });
        }
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  )
  .get(
    "/:id",
    async (
      req: Request<{ id: string }, unknown, unknown, { id: string }>,
      res: Response
    ) => {
      try {
        const server = await serverService.getServerDetails(req.params.id);
        return res.json({ server: ServerView.fromServer(server) });
      } catch (err) {
        if (err instanceof BackendError) {
          return res
            .status(err.httpStatusCode)
            .json({ message: `${err.name} : ${err.message}` });
        }
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  );

export default ServerController;
