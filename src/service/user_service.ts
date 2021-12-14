import { Types } from "mongoose";
import BackendError from "../exceptions/backend_error";
import BadRequest from "../exceptions/bad_request";
import EntityNotFound from "../exceptions/entity_not_found";
import ServerError from "../exceptions/server_error";
import { IDiscordUser } from "../models/IDiscord";
import userModel, { IUser } from "../models/IUser";

class UserService {
  /**
   *
   * @param id
   * @returns Promise<IUser>
   */
  async getOneById(id: string): Promise<IUser> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequest(`Invalid user id : ${id}`);

    const user = await userModel.findById(id);
    if (!user) throw new EntityNotFound(`User not found ${id}`, "user");
    return user;
  }

  /**
   *
   * @param userPayload
   * @returns Promise<IUser>
   */
  async addOne(userPayload: {
    username: string;
    access_token: string;
    refresh_token: string;
    avatar_id: string;
    discord_id: string;
  }): Promise<IUser> {
    const { discord_id } = userPayload;

    try {
      const existingUser = await userModel.findOne({ discord_id });
      if (existingUser) {
        // update the refresh and access token of the user
        existingUser.username = userPayload.username;
        existingUser.access_token = userPayload.access_token;
        existingUser.refresh_token = userPayload.refresh_token;
        existingUser.avatar_id = userPayload.avatar_id;
        return await existingUser.save();
      }
      const user = await userModel.create({ ...userPayload });
      return user;
    } catch (err: unknown) {
      console.log(err);
      throw new BadRequest(`${err}`);
    }
  }

  /**
   *
   * @param accessToken
   * @param refreshToken
   * @param discordUser
   * @returns Promise<IUser>
   */
  async saveFromDiscordUser(
    accessToken: string,
    refreshToken: string,
    discordUser: IDiscordUser
  ): Promise<IUser> {
    const user = {
      access_token: accessToken,
      username: discordUser.username,
      discord_id: discordUser.id,
      avatar_id: discordUser.avatar,
      refresh_token: refreshToken,
    };
    return await this.addOne({ ...user });
  }


  async update(user: Partial<Omit<IUser,"_id">>,id:string): Promise<IUser> {
    try {
      const updated =  await userModel.findByIdAndUpdate(id,user, {new:true});
      if(!updated) throw new EntityNotFound("Failed to update user, user not found", "user");

      return updated;
    }catch(err) {
      if( err instanceof BackendError) throw err;
      throw new ServerError("Something went wrong while updating user");
    }
  }
}

export default UserService;
