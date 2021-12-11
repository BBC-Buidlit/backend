import axios from "axios";
import DiscordClient from "../client/discord_client";
import BadRequest from "../exceptions/bad_request";
import EntityNotFound from "../exceptions/entity_not_found";
import ServerError from "../exceptions/server_error";
import UnAuthorized from "../exceptions/unauthorized";
import { IDiscordServer } from "../models/IDiscord";
import { IUser } from "../models/IUser";

export default class DiscordService {
  discordClient: DiscordClient;

  constructor(discord: DiscordClient) {
    this.discordClient = discord;
  }

  async getUserDetails(accessToken: string, userId?: string) {
    try {
      return await this.discordClient.getUserDetails(accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code == "400") {
          throw new BadRequest(
            `Failed to fetch user details from discord for user: ${userId} , error : ${err.message}`
          );
        } else if (err.code == "404") {
          throw new BadRequest(
            `User not found on discord for user: ${userId} , error : ${err.message}`
          );
        }
      }
      console.error(`Failed to fetch User Details userId: ${userId} , ${err}`);
      throw new ServerError(
        `Failed to fetch user details from discord for user: ${userId}`
      );
    }
  }

  async getUserGuilds(accessToken: string, userId: string) {
    try {
      return await this.discordClient.getUserGuilds(accessToken);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code == "400") {
          throw new BadRequest(
            `Failed to fetch user guilds from discord for user: ${userId} , error : ${err.message}`
          );
        } else if (err.code == "404") {
          throw new BadRequest(
            `User not found on guilds for user: ${userId} , error : ${err.message}`
          );
        }
      }
      console.error(`Failed to fetch User Details userId: ${userId} , ${err}`);
      throw new ServerError(
        `Failed to fetch user guilds from discord for user: ${userId}`
      );
    }
  }

  async getGuildDetails(serverId: string): Promise<IDiscordServer> {
    try {
      return await this.discordClient.getServerDetails(serverId);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.toJSON());
        const status = err.response?.status;
        const message = err.response?.data;
        if (status && status == 400) {
          throw new BadRequest(
            `Failed to fetch server guilds from discord for server: ${serverId} , error : ${message}`
          );
        } else if (status && status == 404) {
          throw new EntityNotFound(
            `Server not found, server: ${serverId} , error : ${message}`,
            "server"
          );
        } else if (status && status === 403) {
          throw new UnAuthorized(
            `Server: ${serverId} cannot be accessed by us, please invite our bot to import the server`
          );
        }
      }
      console.error(err);
      throw new ServerError(
        `Failed to fetch server details from discord for server: ${serverId}`
      );
    }
  }

  async getAccessToken(
    discordAuth: string,
    clientId: string,
    code: string,
    redirectUrl: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      console.log(discordAuth, clientId, code, redirectUrl);
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUrl);
      params.append("scope", "identify"); //changed to guilds as well :()

      const response = await this.discordClient.getAccessToken(
        discordAuth,
        params
      );
      return response;
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.code == "400") {
          throw new BadRequest(
            `Bad request, while fetching token from discord`
          );
        } else if (err.code == "401") {
          throw new UnAuthorized(`Not authorized`);
        }
      }
      throw new ServerError(
        `Something went wrong, while fetching token from discord`
      );
    }
  }

  async refreshAccessToken(
    discordAuth: string,
    clientId: string,
    refreshToken: string
  ) {
    try {
      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", refreshToken);

      // const response = await this.discordClient.getAccessToken(
      //   discordAuth,
      //   params
      // );
      // return response;
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.code == "400") {
          throw new BadRequest(
            `Bad request, while fetching token from discord`
          );
        } else if (err.code == "401") {
          throw new UnAuthorized(`Not authorized`);
        }
      }
      throw new ServerError(
        `Something went wrong, while fetching token from discord`
      );
    }
  }
}
