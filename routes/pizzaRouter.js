const express = require("express");
const router = express.Router();
// const PizzaBase = require("../models/PizzaBase");
// const PizzaMeat = require("../models/PizzaMeat");
// const PizzaSauce = require("../models/PizzaSauce");
// const PizzaVeggies = require("../models/PizzaVegies");
// const PizzaCheese = require("../models/PizzaCheese");
const PizzaModel = require("../models/Pizza");
const authenticate = require("../middlewares/auth");

/*
    @usage : to get all pizza belonging to a particular category  
    @url : /api/admin/manage-pizza/getpizza/category
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

/*
    @usage : to add a pizza  
    @url : /api/admin/manage-pizza/addpizza
    @fields : pizzaName, pizzaDescription, category, pizzaAvatar,baseId,price,toppings,sauce
    @method : post
    @access : PRIVATE
 */

router.post("/addpizza", authenticate, async (req, res) => {
  const {
    pizzaName,
    pizzaDescription,
    category,
    pizzaAvatar,
    base,
    price,
    toppings,
    sauce,
  } = req.body;
  try {
    let pizzaData = new PizzaModel({
      pizzaName,
      category,
      pizzaDescription,
      pizzaAvatar,
      toppings,
      sauce,
      base,
      price,
    });
    let pizzaSave = await pizzaData.save();
    return res.status(200).json({ pizzaDetails: pizzaSave });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to update the contents of a pizza  
    @url : /api/admin/manage-pizza/update-pizza
    @fields : pizzaName, pizzaDescription, category, pizzaAvatar,baseId,price,toppings,sauce
    @method : post
    @access : PRIVATE
 */

router.post("/update-pizza/:pizzaId", authenticate, async (req, res) => {
  const {
    pizzaName,
    pizzaDescription,
    category,
    pizzaAvatar,
    base,
    price,
    toppings,
    sauce,
  } = req.body;
  const pizzaId = req.params.pizzaId;
  //   console.log(pizzaId);
  try {
    let updatedPizza = await PizzaModel.findOneAndUpdate(
      { _id: pizzaId },
      {
        $set: {
          pizzaName: pizzaName,
          pizzaDescription: pizzaDescription,
          category: category,
          pizzaAvatar: pizzaAvatar,
          base: base,
          price: price,
          toppings: toppings,
          sauce: sauce,
        },
      },
      { new: true }
    );
    // console.log(updatedPizza);
    if (!updatedPizza) {
      return res.status(202).json({ error: "Pizza not found" });
    }
    return res.status(200).json({ pizzaData: updatedPizza });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : delete a pizza by pizzaId
    @url : /api/admin/manage-pizza/delete-pizza/:pizzaId
    @method : delete
    @access : PRIVATE
*/

router.delete("/delete-pizza/:pizzaId", authenticate, async (req, res) => {
  let pizzaId = req.params.pizzaId;
  try {
    let deletedPizza = await PizzaModel.findByIdAndDelete(pizzaId);
    if (!deletedPizza) {
      return res.status(202).json({ error: "Pizza not found" });
    }
    return res.status(200).json({ message: "Pizza deleted successfully" });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

module.exports = router;
