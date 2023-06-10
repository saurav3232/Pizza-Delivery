const mongoose = require("mongoose");

const VeggiesSchema = new mongoose.Schema(
  {
    veggiesName: { type: String, required: true },
    veggiesQuantity:{type:Number,required:true},
  },
  { timestamps: true }
);

const PizzaVeggies = mongoose.model("pizzaVeggies", VeggiesSchema);
module.exports = PizzaVeggies;
