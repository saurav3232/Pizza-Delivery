const mongoose = require("mongoose");

const PizzaSchema = new mongoose.Schema(
  {
    pizzaName: { type: String, required: true },
    pizzaDescription:{type:String,required:true,default:""},
    pizzaAvatar: { type: String, required: true },
    category:{type:String,required:true},
    toppings:{type:Object,required:true},
    sauce:{type:Object,required:true},
    base:{type:Object,required:true},
    price:{type:Object,required:true},
  },
  { timestamps: true }
);

const PizzaModel = mongoose.model("pizza", PizzaSchema);
module.exports = PizzaModel;
