import axios from "axios";
import DiscordClient from "../client/discord_client";
import BadRequest from "../exceptions/bad_request";
import ServerError from "../exceptions/server_error";

export default class DiscordService {
  discordClient: DiscordClient;

  constructor(discord: DiscordClient) {
    this.discordClient = discord;
  }

  async getUserDetails(accessToken: string, userId: string) {
    try {
      this.discordClient.getUserDetails(accessToken);
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
}
