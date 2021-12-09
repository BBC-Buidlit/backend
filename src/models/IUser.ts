import { model, Schema } from "mongoose";

export interface IUser {
  access_token: string;
  username: string;
  wallet_id: string;
  discord_id: string; // the uuid which maps to discord
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
  wallet_id: {
    type: String,
    unique: true,
  },
});

const userModel = model<IUser>("user", userSchema);

export default userModel;
