const mongoose = require("mongoose");

const CheeseSchema = new mongoose.Schema(
  {
    cheeseName: { type: String, required: true },
    cheeseQuantity:{type:Number,required:true},
  },
  { timestamps: true }
);

const PizzaCheese = mongoose.model("pizzaCheese", CheeseSchema);
module.exports = PizzaCheese;
