import axios from "axios";
import {
  IDiscordAuthResponse,
  IDiscordServer,
  IDiscordServerOveriew,
  IDiscordUser,
} from "../models/IDiscord";

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

  async getUserGuilds(accessToken: string): Promise<IDiscordServerOveriew[]> {
    const response = await api.request<IDiscordServerOveriew[]>({
      method: "GET",
      url: "users/@me/guilds",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async getServerDetails(serverId: string): Promise<IDiscordServer> {
    const response = await api.request<IDiscordServer>({
      method: "GET",
      url: `guilds/${serverId}`,
      headers: {
        Authorization: `Bot NzcwNjYxMTU2MzM1Mzg2NjI2.X5g0IQ.CAeOm4yKe6WXvaAiQfy35EpIccs`, //todo: use environment tracker
      },
    });
    return response.data;
  }

  async getAccessToken(
    discordAuth: string,
    params: URLSearchParams
  ): Promise<{ access_token: string; refresh_token: string }> {
    const response = await axios({
      url: "https://discordapp.com/api/oauth2/token",
      method: "POST",
      data: params,
      headers: {
        Authorization: discordAuth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const { access_token, refresh_token } = response.data;
    return { access_token, refresh_token };
  }
  async refreshAccessToken(
    discordAuth: string,
    params: URLSearchParams
  ): Promise<{ access_token: string; refresh_token: string }> {
    const response = await axios.post<IDiscordAuthResponse>(
      "https://discordapp.com/api/oauth2/token/revoke",
      {
        data: params,
        headers: {
          Authorization: discordAuth,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );
    const { access_token, refresh_token } = response.data;
    return { access_token, refresh_token };
  }
}

export default DiscordClient;
