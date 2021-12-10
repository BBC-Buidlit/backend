import { Types } from "mongoose";
import BadRequest from "../exceptions/bad_request";
import EntityNotFound from "../exceptions/entity_not_found";
import { IDiscordUser } from "../models/IDiscord";
import userModel, { IUser } from "../models/IUser";

class UserService {
  async getOneById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequest(`Invalid user id : ${id}`);

    const user = await userModel.findById(id);
    if (!user) throw new EntityNotFound("User not found ${id}", "user");
    return user;
  }

  async addOne(userPayload: IUser) {
    try {
      const user = await userModel.create({ ...userPayload });
      return user;
    } catch (err: unknown) {
      throw new BadRequest(`${err}`);
    }
  }

  async saveFromDiscordUser(accessToken: string, discordUser: IDiscordUser) {
    const user: IUser = {
      access_token: accessToken,
      username: discordUser.username,
      discord_id: discordUser.id,
      avatar_id: discordUser.avatar,
    };
    return await this.addOne({ ...user });
  }
}

export default UserService;
