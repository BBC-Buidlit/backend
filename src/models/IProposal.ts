import { Schema } from "mongoose";

export interface IProposal {
  user_id: string;
  server_id: string;
  question_id: string;
  question_text: string;
}

const proposalSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  server_id: {
    type: String,
    required: true,
  },
  question_id: {
    type: String,
    required: true,
  },
  question_text: {
    type: String,
    required: true,
  },
});

export default proposalSchema;
