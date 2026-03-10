
const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  title: String,
  description: String,
  severity: { type: String, enum: ["low","medium","high"] },
  status: { type: String, enum: ["open","investigating","resolved"], default:"open" },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
