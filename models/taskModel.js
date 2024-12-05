const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  planner: { type: mongoose.Schema.Types.ObjectId, ref: "Planner", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completedHours: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  target: { type: Number, required: true ,default:0},         
  progress: { type: Number, default: 0 },          
  week: { type: Number,default:0 },           
}, { timestamps: true });



module.exports = mongoose.model("Task", taskSchema);

