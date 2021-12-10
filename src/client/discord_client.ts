import axios from "axios";
import { IDiscordServer, IDiscordUser } from "../models/IDiscord";

const api = axios.create({
  baseURL: "https://discord.com/api/",
});

class DiscordClient {
  async getUserDetails(accessToken: string): Promise<IDiscordUser> {
    const response = await api.request<IDiscordUser>({
      method: "GET",
      url: "users/@me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async getUserGuilds(accessToken: string): Promise<IDiscordServer[]> {
    const response = await api.request<IDiscordServer[]>({
      method: "GET",
      url: "users/@me/guilds",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
}

export default DiscordClient;
