import { AxiosInstance } from "axios";
import { IDiscordServer, IDiscordUser } from "../models/IDiscord";

class DiscordClient {
  axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  async getUserDetails(accessToken: string): Promise<IDiscordUser> {
    const response = await this.axios.request<IDiscordUser>({
      method: "GET",
      url: "users/@me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async getUserGuilds(accessToken: string): Promise<IDiscordServer[]> {
    const response = await this.axios.request<IDiscordServer[]>({
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
