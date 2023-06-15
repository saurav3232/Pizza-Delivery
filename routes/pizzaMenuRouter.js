const express = require("express");
const router = express.Router();
const PizzaModel = require("../models/Pizza");
const authenticate = require("../middlewares/auth");
const PizzaBase = require("../models/PizzaBase");
/*
    @usage : to get all pizza belonging to a particular category  
    @url : /api/users/pizza-menu/getpizza/category
    @fields : category
    @method : get
    @access : PRIVATE
 */

router.get("/getpizza/:category", authenticate, async (req, res) => {
  let cat = req.params.category;
  try {
    let pizzaData = await PizzaModel.find({
      category: cat,
    });
    return res.status(200).json({ pizzaData: pizzaData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

router.post("/cart/confirm-order", authenticate, async (req, res) => {
  // const reqArray=JSON.parse(req.body);
  // console.log(JSON.parse(req.body.toString()));
  const cartItems = req.body.cartItems;
  const transformedCartItems = req.body.cartItems.reduce(
    (accumulator, cartItem) => {
      const baseId = cartItem.pizzaData.base.baseId;
      const sizesObj = {};

      cartItem.sizes.forEach((sizeObj) => {
        const size = sizeObj.size.toLowerCase();
        const count = sizeObj.count;

        sizesObj[size] = count;
      });

      const existingItem = accumulator.find((item) => item.baseId === baseId);

      if (existingItem) {
        // Merge the sizesObj with existingItem.sizesObj for the same base
        for (const size in sizesObj) {
          if (existingItem.sizesObj.hasOwnProperty(size)) {
            existingItem.sizesObj[size] += sizesObj[size];
          } else {
            existingItem.sizesObj[size] = sizesObj[size];
          }
        }
      } else {
        accumulator.push({ baseId, sizesObj });
      }

      return accumulator;
    },
    []
  );

  const insufficientBases = [];

  for (const item of transformedCartItems) {
    const baseId = item.baseId;
    const sizes = item.sizesObj;

    const pizzaBase = await PizzaBase.findById(baseId);

    const insufficientSizes = [];

    for (const size in sizes) {
      const count = sizes[size];
      const quantity = pizzaBase[`${size}Quantity`];

      if (count > quantity) {
        const insufficientAmount = count - quantity;
        insufficientSizes.push({ size, insufficientAmount });
      }
    }

    if (insufficientSizes.length > 0) {
      insufficientBases.push({ baseId, sizes: insufficientSizes });
    }
  }

  const messages = [];

  for (const cartItem of cartItems) {
    const baseId = cartItem.pizzaData.base.baseId;

    const insufficientSizes = insufficientBases.find(
      (insufficientBase) => insufficientBase.baseId === baseId
    );

    if (insufficientSizes) {
      for (const sizeObj of cartItem.sizes) {
        const size = sizeObj.size;
        const insufficientSize = insufficientSizes.sizes.find(
          (sizeObj) => sizeObj.size === size
        );

        if (insufficientSize) {
          const insufficientAmount = insufficientSize.insufficientAmount;
          const pizzaName = cartItem.pizzaData.pizzaName;

          const orderedQuantity = sizeObj.count;
          const remainingQuantity = orderedQuantity - insufficientAmount;

          if (remainingQuantity > 0) {
            messages.push({ pizzaName, insufficientAmount, size });
          }
        }
      }
    }
  }

  console.log(messages);

  // console.log(insufficientBases);
  // console.log(transformedCartItems);
  if (messages.length === 0) {
    return res.status(200).json({ msg: "Order Confirmed" });
  }
  return res.status(201).json({ msg: messages });
});

module.exports = router;
