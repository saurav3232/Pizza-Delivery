const express = require("express");
const router = express.Router();
const PizzaBase = require("../models/PizzaBase");
const PizzaMeat = require("../models/PizzaMeat");
const PizzaSauce = require("../models/PizzaSauce");
const PizzaVeggies = require("../models/PizzaVegies");
const PizzaCheese = require("../models/PizzaCheese");
const authenticate = require("../middlewares/auth");

/*
    @usage : to add a pizza base 
    @url : /api/admin/manage-stocks/add/pizzabase
    @fields : baseName, smallQuantity, mediumQuantity, largeQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/add/pizzabase", authenticate, async (req, res) => {
  const { baseName, smallQuantity, mediumQuantity, largeQuantity } = req.body;
  try {
    let pizzabaseProfile = new PizzaBase({
      baseName,
      smallQuantity,
      mediumQuantity,
      largeQuantity,
    });
    const pizzaBaseData = await pizzabaseProfile.save();
    return res.status(200).json({ pizzaBaseData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to get all pizza bases 
    @url : /api/admin/manage-stocks/getpizzabase
    @method : get
    @access : PRIVATE
 */
router.get("/getpizzabase", authenticate, async (req, res) => {
  try {
    const data = await PizzaBase.find({});
    return res.status(200).json({ PizzaBases: data });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to update the quantities of a pizza base
    @url : /api/admin/manage-stocks/update/pizzabase/:baseid
    @fields : smallQuantity, mediumQuantity, largeQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/update/pizzabase/:baseid", authenticate, async (req, res) => {
  const { baseName, smallQuantity, mediumQuantity, largeQuantity } = req.body;
  const pizzabaseId = req.params.baseid;
  try {
    const updatedPizzaBase = await PizzaBase.findByIdAndUpdate(
      pizzabaseId,
      {
        $set: {
          baseName: baseName,
          smallQuantity: smallQuantity,
          mediumQuantity: mediumQuantity,
          largeQuantity: largeQuantity,
        },
      },
      { new: true }
    );

    if (!updatedPizzaBase) {
      return res.status(202).json({ error: "PizzaBase not found" });
    }

    return res.status(200).json({ pizzaBaseData: updatedPizzaBase });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to delete a pizza base
    @url : /api/admin/manage-stocks/delete/pizzabase/:baseid
    @method : delete
    @access : PRIVATE
 */
router.delete("/delete/pizzabase/:baseid", authenticate, async (req, res) => {
  const baseId = req.params.baseid;
  try {
    // Delete the PizzaBase document
    await PizzaBase.findByIdAndDelete(baseId);

    return res.status(200).json({ msg: "Pizza base deleted Successfully" });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to add a pizza sauce 
    @url : /api/admin/manage-stocks/add/pizzasauce
    @fields : sauceName, sauceQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/add/pizzasauce", authenticate, async (req, res) => {
  const { sauceName, sauceQuantity } = req.body;
  try {
    let pizzaSauceProfile = new PizzaSauce({
      sauceName,
      sauceQuantity,
    });
    const pizzaSauceData = await pizzaSauceProfile.save();
    return res.status(200).json({ pizzaSauceData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to get all pizza sauces 
    @url : /api/admin/manage-stocks/getpizzasauce
    @method : get
    @access : PRIVATE
 */
router.get("/getpizzasauce", authenticate, async (req, res) => {
  try {
    const data = await PizzaSauce.find({});
    return res.status(200).json({ PizzaSauce: data });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to update the quantity of a pizza sauce
    @url : /api/admin/manage-stocks/update/pizzasauce/:sauceid
    @fields : sauceQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/update/pizzasauce/:sauceid", authenticate, async (req, res) => {
  const { sauceName, sauceQuantity } = req.body;
  const sauceId = req.params.sauceid;
  try {
    const updatedPizzaSauce = await PizzaSauce.findByIdAndUpdate(
      sauceId,
      {
        $set: {
          sauceName: sauceName,
          sauceQuantity: sauceQuantity,
        },
      },
      { new: true }
    );

    if (!updatedPizzaSauce) {
      return res.status(202).json({ error: "PizzaSauce not found" });
    }

    return res.status(200).json({ pizzaSauceData: updatedPizzaSauce });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to delete a pizza sauce
    @url : /api/admin/manage-stocks/delete/pizzasauce/:sauceid
    @method : delete
    @access : PRIVATE
 */
router.delete("/delete/pizzasauce/:sauceid", authenticate, async (req, res) => {
  const sauceId = req.params.sauceid;
  try {
    // Delete the PizzaSauce document
    await PizzaSauce.findByIdAndDelete(sauceId);

    // Fetch all the remaining PizzaSauce documents
    const pizzaSauces = await PizzaSauce.find({});

    return res.status(200).json({ pizzaSauces });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to add pizza veggies 
    @url : /api/admin/manage-stocks/add/pizzaveggies
    @fields : veggiesName, veggiesQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/add/pizzaveggies", authenticate, async (req, res) => {
  const { veggiesName, veggiesQuantity } = req.body;
  try {
    let pizzaVeggiesProfile = new PizzaVeggies({
      veggiesName,
      veggiesQuantity,
    });
    const pizzaVeggiesData = await pizzaVeggiesProfile.save();
    return res.status(200).json({ pizzaVeggiesData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to get all pizza veggies 
    @url : /api/admin/manage-stocks/getpizzaveggies
    @method : get
    @access : PRIVATE
 */
router.get("/getpizzaveggies", authenticate, async (req, res) => {
  try {
    const data = await PizzaVeggies.find({});
    return res.status(200).json({ PizzaVeggies: data });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to update the quantity of a pizza veggies
    @url : /api/admin/manage-stocks/update/pizzaveggies/:veggiesid
    @fields : veggiesQuantity
    @method : post
    @access : PRIVATE
 */
router.post(
  "/update/pizzaveggies/:veggiesid",
  authenticate,
  async (req, res) => {
    const { veggiesName, veggiesQuantity } = req.body;
    const veggiesId = req.params.veggiesid;
    try {
      const updatedPizzaVeggies = await PizzaVeggies.findByIdAndUpdate(
        veggiesId,
        {
          $set: {
            veggiesName: veggiesName,
            veggiesQuantity: veggiesQuantity,
          },
        },
        { new: true }
      );

      if (!updatedPizzaVeggies) {
        return res.status(202).json({ error: "PizzaVeggies not found" });
      }

      return res.status(200).json({ pizzaVeggiesData: updatedPizzaVeggies });
    } catch (error) {
      return res.status(201).json({ error: error.message });
    }
  }
);

/*
    @usage : to delete a pizza veggies
    @url : /api/admin/manage-stocks/delete/pizzaveggies/:veggiesid
    @method : delete
    @access : PRIVATE
 */
router.delete(
  "/delete/pizzaveggies/:veggiesid",
  authenticate,
  async (req, res) => {
    const veggiesId = req.params.veggiesid;
    try {
      // Delete the PizzaVeggies document
      await PizzaVeggies.findByIdAndDelete(veggiesId);

      // Fetch all the remaining PizzaVeggies documents
      const pizzaVeggies = await PizzaVeggies.find({});

      return res.status(200).json({ pizzaVeggies });
    } catch (error) {
      return res.status(201).json({ error: error.message });
    }
  }
);

/*
    @usage : to add pizza meat 
    @url : /api/admin/manage-stocks/add/pizzameat
    @fields : meatName, meatQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/add/pizzameat", authenticate, async (req, res) => {
  const { meatName, meatQuantity } = req.body;
  try {
    let pizzaMeatProfile = new PizzaMeat({
      meatName,
      meatQuantity,
    });
    const pizzaMeatData = await pizzaMeatProfile.save();
    return res.status(200).json({ pizzaMeatData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
        @usage : to get all pizza meat 
        @url : /api/admin/manage-stocks/getpizzameat
        @method : get
        @access : PRIVATE
     */
router.get("/getpizzameat", authenticate, async (req, res) => {
  try {
    const data = await PizzaMeat.find({});
    return res.status(200).json({ PizzaMeat: data });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
        @usage : to update the quantity of a pizza meat
        @url : /api/admin/manage-stocks/update/pizzameat/:meatid
        @fields : meatQuantity
        @method : post
        @access : PRIVATE
     */
router.post("/update/pizzameat/:meatid", authenticate, async (req, res) => {
  const { meatName, meatQuantity } = req.body;
  const meatId = req.params.meatid;
  try {
    const updatedPizzaMeat = await PizzaMeat.findByIdAndUpdate(
      meatId,
      {
        $set: {
          meatName: meatName,
          meatQuantity: meatQuantity,
        },
      },
      { new: true }
    );

    if (!updatedPizzaMeat) {
      return res.status(202).json({ error: "PizzaMeat not found" });
    }

    return res.status(200).json({ pizzaMeatData: updatedPizzaMeat });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
        @usage : to delete a pizza meat
        @url : /api/admin/manage-stocks/delete/pizzameat/:meatid
        @method : delete
        @access : PRIVATE
     */
router.delete("/delete/pizzameat/:meatid", authenticate, async (req, res) => {
  const meatId = req.params.meatid;
  try {
    // Delete the PizzaMeat document
    await PizzaMeat.findByIdAndDelete(meatId);

    // Fetch all the remaining PizzaMeat documents
    const pizzaMeat = await PizzaMeat.find({});

    return res.status(200).json({ pizzaMeat });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
    @usage : to add pizza cheese 
    @url : /api/admin/manage-stocks/add/pizzacheese
    @fields : cheeseName, cheeseQuantity
    @method : post
    @access : PRIVATE
 */
router.post("/add/pizzacheese", authenticate, async (req, res) => {
  const { cheeseName, cheeseQuantity } = req.body;
  try {
    let pizzaCheeseProfile = new PizzaCheese({
      cheeseName,
      cheeseQuantity,
    });
    const pizzaCheeseData = await pizzaCheeseProfile.save();
    return res.status(200).json({ pizzaCheeseData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
  @usage : to get all pizza cheese
  @url : /api/admin/manage-stocks/getpizzacheese
  @method : get
  @access : PRIVATE
*/
router.get("/getpizzacheese", authenticate, async (req, res) => {
  try {
    const pizzaCheese = await PizzaCheese.find({});
    return res.status(200).json({ pizzaCheese });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
  @usage : to update pizza cheese
  @url : /api/admin/manage-stocks/update/pizzacheese/:id
  @fields : cheeseName, cheeseQuantity
  @method : put
  @access : PRIVATE
*/
router.post("/update/pizzacheese/:id", authenticate, async (req, res) => {
  const { cheeseName, cheeseQuantity } = req.body;
  const { id } = req.params;
  try {
    const updatedPizzaCheese = await PizzaCheese.findByIdAndUpdate(
      id,
      { $set: { cheeseName: cheeseName, cheeseQuantity: cheeseQuantity } },
      { new: true }
    );
    if (!updatedPizzaCheese) {
      return res.status(202).json({ error: "Pizza cheese not found" });
    }
    return res.status(200).json({ pizzaCheese: updatedPizzaCheese });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

/*
  @usage : to delete pizza cheese
  @url : /api/admin/manage-stocks/delete/pizzacheese/:id
  @method : delete
  @access : PRIVATE
*/
router.delete("/delete/pizzacheese/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPizzaCheese = await PizzaCheese.findByIdAndDelete(id);
    if (!deletedPizzaCheese) {
      return res.status(202).json({ error: "Pizza cheese not found" });
    }
    const allCheeseData = await PizzaCheese.find({});
    return res.status(200).json({ cheeseData: allCheeseData });
  } catch (error) {
    return res.status(201).json({ error: error.message });
  }
});

module.exports = router;
