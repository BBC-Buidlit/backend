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
	/**
	 * @description Get user details from discord
	 * @param accessToken
	 * @returns Promise<IDiscordUser>
	 */
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

	/**
	 *
	 * @description Get guilds connected to the user
	 * @param accessToken
	 * @returns Promise<IDiscordServerOveriew[]>
	 */
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

	/**
	 * @description Get server details using server id from discord. Make sure the bot is invited to the server
	 * @param serverId
	 * @returns
	 */
	async getServerDetails(serverId: string): Promise<IDiscordServer> {
		try {
			const { DISCORD_BOT_KEY } = process.env;
			if (!DISCORD_BOT_KEY) throw new Error("Bot key is required");
			const response = await api.request<IDiscordServer>({
				method: "GET",
				url: `guilds/${serverId}`,
				headers: {
					Authorization: `Bot ${DISCORD_BOT_KEY}`,
				},
			});
			return response.data;
		} catch (err: unknown) {
			console.log({ err });
			throw err;
		}
	}

	/**
	 * @description get access token from discord oauth
	 * @param discordAuth
	 * @param params
	 * @returns  Promise<{ access_token: string; refresh_token: string }>
	 */
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

	/**
	 * @description Get new access keys using refresh token from discord oauth
	 * @param discordAuth
	 * @param params
	 * @returns Promise<{ access_token: string; refresh_token: string }>
	 */
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
