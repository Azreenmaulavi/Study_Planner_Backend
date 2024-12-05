const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "user",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Planner", plannerSchema);
