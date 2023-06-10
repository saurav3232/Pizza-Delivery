const mongoose = require("mongoose");

const MeatSchema = new mongoose.Schema(
  {
    meatName: { type: String, required: true },
    meatQuantity:{type:Number,required:true},
  },
  { timestamps: true }
);

const PizzaMeat = mongoose.model("pizzaMeat", MeatSchema);
module.exports = PizzaMeat;
