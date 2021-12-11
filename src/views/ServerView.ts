import { IDiscordServerOveriew } from "../models/IDiscord";
import { IServer } from "../models/IServer";

/**
 *
 * @description This is a view layer class which casts IServer to required object while sending to client
 *
 */
class ServerView {
  id: string | null = "";
  discord_id = "";
  avatar: string | null = "";
  name = "";
  owner_id: string | null = null;

  constructor(
    id: string | null,
    discordId: string,
    name: string,
    owner_id: string,
    avatar: string | null
  ) {
    this.id = id;
    this.discord_id = discordId;
    this.name = name;
    this.avatar = avatar
      ? `https://cdn.discordapp.com/icons/${discordId}/${avatar}`
      : null;
    this.owner_id = owner_id;
  }

  static fromServer(guild: IServer) {
    return new ServerView(
      guild._id,
      guild.discord_id,
      guild.name,
      guild.owner_id,
      guild.icon
    );
  }
}

export default ServerView;
