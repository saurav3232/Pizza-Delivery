const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const authenticate = require("../middlewares/auth");
const crypto=require("crypto");
const RazorPayInstance = new Razorpay({
  key_id: process.env.RAZOR_PAY_API_KEY_ID,
  key_secret: process.env.RAZOR_PAY_API_KEY_SECRET,
});

router.post("/createOrders", authenticate, async (req, res) => {
  const amount = req.body.amount;
  var options = {
    amount: Number(amount) * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  const order = await RazorPayInstance.orders.create(options);
  console.log(order);
  res.status(200).json({ order });
});

router.get("/getkey", authenticate, (req, res) => {
  return res.status(200).json({ key: process.env.RAZOR_PAY_API_KEY_ID });
});

router.post("/paymentverification",authenticate,async(req,res)=>{

    console.log(req.body.razorpayDetails);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.razorpayDetails;
    console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature);
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_API_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    // await Payment.create({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature,
    // });
    return res.status(200).json({msg:"Sign is valid"})
    
  } else {
    res.status(201).json({
      success: false,
    });
  }

})

module.exports = router;
