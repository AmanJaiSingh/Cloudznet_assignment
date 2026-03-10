
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Team", teamSchema);
