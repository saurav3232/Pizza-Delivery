const mongoose = require("mongoose");

const PizzaSauceSchema = new mongoose.Schema(
  {
    sauceName: { type: String, required: true },
    sauceQuantity:{type:Number,required:true},
  },
  { timestamps: true }
);

const PizzaSauce = mongoose.model("pizzaSauce", PizzaSauceSchema);
module.exports = PizzaSauce;
