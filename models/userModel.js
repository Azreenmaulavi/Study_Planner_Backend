const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    otp: { type: String, default: null },
    totalStudyTime: { 
      type: Number, 
      default: 0 
    }
  },
  

  {
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;