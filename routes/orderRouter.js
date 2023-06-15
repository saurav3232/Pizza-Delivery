const express = require("express");
const router = express.Router();
const Order=require("../models/Order")
const authenticate = require("../middlewares/auth");

router.post("/add-order",authenticate,async(req, res)=>{
    const orderData=new Order(req.body.orderData);
    try {
        const data = await orderData.save();
        return  res.status(200).json({msg:"Order Saved Successfully",orderId:data._id})
    } catch (error) {
        return res.status(201).json({msg:error.message});
    }

})

router.get("/getmyorders/:userId", authenticate, async (req, res) => {
    const userId = req.params.userId;
    try {
      const data = await Order.find({ userId: userId }).sort({ createdAt: -1 });
      return res.status(200).json({ orderDetails: data });
    } catch (error) {
      return res.status(201).json({ msg: error.message });
    }
  });
  

router.get("/order/:orderId", authenticate, async (req, res) => {
    const orderId = req.params.orderId.trim(); // Trim the orderId value
    // console.log(orderId);
    try {
      const orderDetails = await Order.findById(orderId);
      return res.status(200).json({ orderDetails });
    } catch (error) {
      return res.status(201).json({ msg: error.message });
    }
  });
  

module.exports = router;
