//AGENT TABLE DATA FOR RECORDS WK7
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  rating: { type: Number, default: 0 }, // general numeric rating
  fee: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
});

const Agent = mongoose.model("Agent", agentSchema, "recordsWk7");

export default Agent;