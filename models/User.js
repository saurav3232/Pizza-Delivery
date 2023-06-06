const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isVerified:{type:Boolean,required:true,default:false},
    msg:{type:Array,required: true,default:[]},
    avatar: { type: String, required: true },
    token:{type:String,default:''}

  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);
module.exports = User;
