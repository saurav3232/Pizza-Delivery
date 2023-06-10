const mongoose = require("mongoose");

const PizzaBaseSchema = new mongoose.Schema(
  {
    baseName: { type: String, required: true },
    smallQuantity:{type:Number,required:true,default:0},
    mediumQuantity:{type:Number,required:true,default:0},
    largeQuantity:{type:Number,required:true,default:0}
  },
  { timestamps: true }
);

const PizzaBase = mongoose.model("pizzaBase", PizzaBaseSchema);
module.exports = PizzaBase;
