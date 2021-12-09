import { model, Schema } from "mongoose";

export interface IServer {
  owner_id: string; // internal id of user
  discord_id: string; // uuid which maps to discord
}
const serverSchema = new Schema({
  owner_id: {
    type: String,
  },
  disord_id: {
    type: String,
  },
});
const serverModel = model<IServer>("server", serverSchema);

export default serverModel;
