import { model, Schema } from "mongoose";

export interface IServer {
  owner_id: string; // internal id of user
  discord_id: string; // uuid which maps to discord
  name: string;
  avatar: string | null;
}
const serverSchema = new Schema({
  owner_id: {
    type: String,
  },
  discord_id: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
});
const serverModel = model<IServer>("server", serverSchema);

export default serverModel;
