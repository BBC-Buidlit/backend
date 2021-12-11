export interface IDiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: string;
  accent_color: number;
  locale: string;
  mfa_enabled: boolean;
}

export interface IDiscordServerOveriew {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

export interface IDiscordServer {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  owner_id: string;
  permissions: number;
  features: string[];
  permissions_new: string;
}

export interface IDiscordAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
