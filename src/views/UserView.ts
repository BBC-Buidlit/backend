import { IUser } from "../models/IUser";

/**
 *
 * @description This is a view layer class which casts IUser to required object while sending to client
 *
 */
class UserView {
  id = "";
  username = "";
  discord_id = "";
  avatar: string | null = "";

  constructor(
    id: string,
    username: string,
    discordId: string,
    avatar?: string
  ) {
    this.id = id;
    this.username = username;
    this.discord_id = discordId;
    this.avatar = avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}`
      : null;
  }

  static fromUser(user: IUser & { _id: string }) {
    return new UserView(
      user._id,
      user.username,
      user.discord_id,
      user.avatar_id
    );
  }
}

export default UserView;
