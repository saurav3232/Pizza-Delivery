const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId:{type:String,required:true},
    name:{type:String,required:true},
    item:{type:Array,required:true},
    address:{type:Object,required:true},
    contact:{type:Object,required:true},
    totalPrice:{type:Number,required:true},
    orderStatus:{type:String,required:true,default:"Order Placed"},
    razorpayDetails:{type:Object,required:true},
    timeOfOrder:{type:String,required:true},
    dateOfOrder:{type:String,required:true},
  },
  { timestamps: true }
);

const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;
