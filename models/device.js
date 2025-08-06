import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["locked", "unlocked"], default: "unlocked" },
  lastSeen: { type: Date, default: Date.now },
});

export default mongoose.model("Device", deviceSchema);
