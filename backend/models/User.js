
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
