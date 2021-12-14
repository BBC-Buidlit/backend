import { Request, Response, Router } from "express";

import axios from "axios";
import UserService from "../../service/user_service";
import DiscordService from "../../service/discord_service";
import DiscordClient from "../../client/discord_client";
const router = Router();
import jwt from "jsonwebtoken";
import UnAuthorized from "../../exceptions/unauthorized";
import BackendError from "../../exceptions/backend_error";
import UserView from "../../views/UserView";
import bcrypt from 'bcrypt';
import BadRequest from "../../exceptions/bad_request";

const userService = new UserService();
const discordService = new DiscordService(new DiscordClient());

export const AuthController = router
  .get("/authorize", async (req: Request, res: Response) => {
    return res.redirect(
      `https://discord.com/api/oauth2/authorize?client_id=770661156335386626&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fauth%2Fcallback&response_type=code&scope=identify%20guilds`
    );
  })
  .get(
    "/callback",
    async (
      req: Request<unknown, unknown, unknown, { code: string }>,
      res: Response
    ) => {
      if (!req.query.code)
        return res.status(400).json({ message: "Code is required" });
      try {
        const { CLIENT_ID, REDIRECT_URI, DISCORD_AUTH } = process.env;
        if (!CLIENT_ID || !REDIRECT_URI || !DISCORD_AUTH)
          return res.status(500).json("Environment variables not found");
        const code = req.query.code;
        const response = await discordService.getAccessToken(
          DISCORD_AUTH,
          CLIENT_ID,
          code,
          REDIRECT_URI
        );
        const discordUser = await discordService.getUserDetails(
          response.access_token
        );
        const user = await userService.saveFromDiscordUser(
          response.access_token,
          response.refresh_token,
          discordUser
        );
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? "");

        return res.redirect(`http://localhost:3000/connect?token=${token}`);
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    }
  )
  .get("/:id/login",  async (req: Request<{id: string},unknown,unknown, {key:string}>, res : Response) => {
      try {
        const {key } = req.query;
        const {id} = req.params;

        const user = await userService.getOneById(id);
        
        if(user.private_key !== key) throw new UnAuthorized("Your key doesn't match");
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? "");
        if(!user.wallet_id) throw new BadRequest("Can't sign token as wallet id is not present!");

        const new_key = await bcrypt.hash(user.wallet_id, 10);
        await userService.update({ private_key: new_key },id);
    
        
        return res.json({user:{...UserView.fromUser(user) },key: new_key,token} );
      }catch(err) {
        if (err instanceof BackendError) {
          return res.status(err.httpStatusCode).json({ err: err.name });
        } else {
          console.error(err);
          return res.status(500).json({ err: "Something went wrong" });
        }
      }
  })

