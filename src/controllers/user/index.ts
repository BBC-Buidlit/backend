import { Request, Response, Router } from "express";
import DiscordClient from "../../client/discord_client";
import BackendError from "../../exceptions/backend_error";
import BadRequest from "../../exceptions/bad_request";
import { IUser } from "../../models/IUser";
import DiscordService from "../../service/discord_service";
import ServerService from "../../service/server_service";
import UserService from "../../service/user_service";
import ServerView from "../../views/ServerView";
import UserView from "../../views/UserView";
import bcrypt from 'bcrypt';
const router = Router();

const userService = new UserService();
const discordService = new DiscordService(new DiscordClient());
const serverService = new ServerService(discordService);
const UserController = router.get(
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
// this will be called once for a user
.post("/import_wallet_id", async( req: Request<unknown,unknown,{wallet_id: string},{id: string}>,res: Response) => {

  try {
    const {wallet_id} = req.body;
    if(!wallet_id) throw new BadRequest("Wallet id is not provided");
    const key = await bcrypt.hash(wallet_id, 10);
    await userService.update({wallet_id, private_key: key },req.query.id)

    // hash a key using wallet id 
    return res.status(200).json({
      key
    })
  }catch(err) {
    if (err instanceof BackendError) {
      return res.status(err.httpStatusCode).json({ err: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ err: "Something went wrong" });
    }
  }
})

export default UserController;
