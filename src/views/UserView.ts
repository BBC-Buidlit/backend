import { IUser } from "../models/IUser";

class UserView {
  id = "";
  username = "";
  discord_id = "";

  constructor(id: string, username: string, discordId: string) {
    this.id = id;
    this.username = username;
    this.discord_id = discordId;
  }

  static fromUser(user: IUser & { _id: string }) {
    return new UserView(user._id, user.username, user.discord_id);
  }
}

export default UserView;
