import { model, Schema } from "mongoose";

export interface IPosition {
  owner_id: string; // internal uuid of owner
  proposal_id: string; // internal uuid of proposal
  server_id: string; // internal uuid of proposal
}

const positionSchema = new Schema({
  owner_id: {
    type: String,
    required: true,
  },
  proposal_id: {
    type: String,
    required: true,
  },
  server_id: {
    type: String,
    required: true,
  },
});

const positionModel = model<IPosition>("positon", positionSchema);

export default positionModel;
