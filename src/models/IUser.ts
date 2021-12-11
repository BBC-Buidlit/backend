import { model, Schema } from "mongoose";

export interface IUser {
  access_token: string;
  username: string;
  avatar_id?: string;
  wallet_id?: string;
  refresh_token: string;
  discord_id: string; // the uuid which maps to discord,
  _id?: string;
}

const userSchema = new Schema({
  access_token: {
    required: true,
    unique: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  discord_id: {
    required: true,
    unique: true,
    type: String,
  },
  refresh_token: {
    required: true,
    type: String,
  },
  wallet_id: {
    type: String,
    unique: true,
  },
  avatar_id: {
    type: String,
  },
});

const userModel = model<IUser>("user", userSchema);

export default userModel;
