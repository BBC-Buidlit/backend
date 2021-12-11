import { IDiscordServerOveriew } from "../models/IDiscord";
import { IServer } from "../models/IServer";

class ServerView {
  id: string | null = "";
  discord_id = "";
  avatar: string | null = "";
  name = "";
  owner = false;

  constructor(
    id: string | null,
    discordId: string,
    name: string,
    owner: boolean,
    avatar: string | null
  ) {
    this.id = null;
    this.discord_id = discordId;
    this.name = name;
    this.avatar = avatar
      ? `https://cdn.discordapp.com/icons/${discordId}/${avatar}`
      : null;
    this.owner = owner;
  }

  static fromGuild(guild: IServer & { id?: string; owner?: boolean }) {
    return new ServerView(
      guild.id ?? null,
      guild.discord_id,
      guild.name,
      guild.owner ?? false,
      guild.icon
    );
  }
}

export default ServerView;
