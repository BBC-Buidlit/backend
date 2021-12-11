import BackendError from "../exceptions/backend_error";
import BadRequest from "../exceptions/bad_request";
import EntityNotFound from "../exceptions/entity_not_found";
import ServerError from "../exceptions/server_error";
import UnAuthorized from "../exceptions/unauthorized";
import { IDiscordServer, IDiscordServerOveriew } from "../models/IDiscord";
import serverModel, { IServer } from "../models/IServer";
import { IUser } from "../models/IUser";
import DiscordService from "./discord_service";

class ServerService {
  /**
   * @description Fetches server details from discord
   * @param serverId uuid of server id
   * @returns Promise<IServer>
   */
  discordService: DiscordService;

  constructor(discordService: DiscordService) {
    this.discordService = discordService;
  }
  async getServerDetails(serverId: string): Promise<IServer> {
    try {
      const server = await serverModel.findById(serverId);
      if (!server) throw new EntityNotFound("User not found ${id}", "user");
      return server;
    } catch (err) {
      console.error(err);
      throw new ServerError(`Failed to fetch server: ${serverId}`);
    }
  }

  /**
   * @description This method fetches connected guilds from discord and filters those which exists on our DB using discord id
   * @param accessToken discord access token of user
   * @param userId user's internal id
   * @returns Promise<IServer[]>
   */
  async getConnectedServers(
    accessToken: string,
    userId: string
  ): Promise<IServer[]> {
    try {
      const discordGuilds = await this.discordService.getUserGuilds(
        accessToken,
        userId
      );
      const servers = await serverModel.find({
        discord_id: {
          $in: discordGuilds.map((discordGuild) => discordGuild.id),
        },
      });
      return servers;
    } catch (err) {
      console.error(err);
      if (err instanceof BackendError) throw err;
      throw new ServerError(`Failed to fetch servers, for user : ${userId}`);
    }
  }

  /**
   *
   * @description It fetches guild details from discords and maps to our server document and saves it.
   * @param accessToken
   * @param discordId
   * @returns Promise<IServer>
   */
  async importFromDiscordServer(
    discordId: string,
    user: IUser
  ): Promise<IServer> {
    try {
      const discordServer = await this.discordService.getGuildDetails(
        discordId
      );
      if (user.discord_id != discordServer.owner_id)
        throw new UnAuthorized(
          `User ${user._id} doesn't have access to import this server`
        );
      const existing = await serverModel.findOne({ discord_id: discordId });
      if (existing)
        throw new BadRequest(
          `Server with discord id ${discordId} already exists`
        );

      const server = await serverModel.create({
        owner_id: discordServer.owner_id,
        discord_id: discordServer.id,
        name: discordServer.name,
        icon: discordServer.icon,
      });
      return server;
    } catch (err) {
      if (err instanceof BackendError) throw err;
      throw new ServerError(
        `Failed to import server from discord : ${discordId}`
      );
    }
  }

  /**
   * @description returns list of discord server previews where user is owner
   * @param accessToken
   * @param user
   * @returns  Promise<IDiscordServerOveriew[]>
   */
  async getGuildsWhereUserIsOwner(
    accessToken: string,
    user: IUser
  ): Promise<IDiscordServerOveriew[]> {
    try {
      if (!user._id)
        throw new ServerError(
          "User id was not persent, while fetching getGuildsWhereUserIsOwner"
        );
      const discordServersPreview = await this.discordService.getUserGuilds(
        accessToken,
        user._id
      );
      return discordServersPreview.filter(
        (discordServerPreview) => discordServerPreview.owner
      );
    } catch (err) {
      throw err;
    }
  }
}

export default ServerService;
