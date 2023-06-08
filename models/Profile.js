const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    msg: { type: Array, required: true, default: [] },
    avatar: { type: String, required: true },
    contact: { type: String, default: "" },
    address: { type: Array, default: [] },
  },
  { timestamps: true }
);

const Profile = mongoose.model("profile", ProfileSchema);
module.exports = Profile;
