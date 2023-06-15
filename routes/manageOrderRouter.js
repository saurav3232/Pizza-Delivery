const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const PizzaBase = require("../models/PizzaBase");
const PizzaMeat = require("../models/PizzaMeat");
const PizzaSauce = require("../models/PizzaSauce");
const PizzaVeggies = require("../models/PizzaVegies");
const PizzaCheese = require("../models/PizzaCheese");
const authenticate = require("../middlewares/auth");
const nodemailer = require("nodemailer");
const { Promise } = require("mongoose");

router.get("/getallorders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ orders: orders });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

const getOrderDetails = async (orderId) => {
  const orderDetails = await Order.findById(orderId);
  return orderDetails.item;
};

const updateBase = async (baseId, quantity, size) => {
  try {
    const pizzaBase = await PizzaBase.findById(baseId);
    let updatedQuantity;
    if (size === "small") {
      updatedQuantity = pizzaBase.smallQuantity - quantity;
      if (updatedQuantity < 0) {
        updatedQuantity = 0;
      }
      pizzaBase.smallQuantity = updatedQuantity;
    } else if (size === "medium") {
      updatedQuantity = pizzaBase.mediumQuantity - quantity;
      if (updatedQuantity < 0) {
        updatedQuantity = 0;
      }
      pizzaBase.mediumQuantity = updatedQuantity;
    } else if (size === "large") {
      updatedQuantity = pizzaBase.largeQuantity - quantity;
      if (updatedQuantity < 0) {
        updatedQuantity = 0;
      }
      pizzaBase.largeQuantity = updatedQuantity;
    }
    await pizzaBase.save();

    if (updatedQuantity < 20) {
      console.log(
        `Updated pizza base: ${pizzaBase.baseName}, Size: ${size}, Updated Quantity: ${updatedQuantity}`
      );
    }
  } catch (error) {
    console.log("Error updating pizza base:", error);
    throw error;
  }
};

const updateBaseHandler = async (pizzaId, size, quantity) => {
  try {
    const pizzaData = await Pizza.findById(pizzaId);
    await updateBase(pizzaData.base.baseId, quantity, size);
  } catch (error) {
    console.log(error.message);
  }
};

const updateVeggies = async (veggieId, quantity) => {
  try {
    const veggieData = await PizzaVeggies.findById(veggieId);
    // console.log(quantity);
    let updatedVeggieQuantity = veggieData.veggiesQuantity - quantity;
    if (isNaN(updatedVeggieQuantity) || updatedVeggieQuantity < 0) {
      updatedVeggieQuantity = 0;
    }
    veggieData.veggiesQuantity = updatedVeggieQuantity;
    await veggieData.save();
    if (updatedVeggieQuantity < 100) {
      console.log(
        `Updated veggies: ${veggieData.veggiesName}, Updated Quantity: ${updatedVeggieQuantity}`
      );
    }
  } catch (error) {
    console.log("Error updating veggies:", error);
    throw error;
  }
};

const updateVeggiesHandler = async (pizzaId, quantity) => {
  try {
    const pizzaData = await Pizza.findById(pizzaId);
    pizzaData.toppings.veggies.map(async (veggie) => {
      await updateVeggies(veggie.veggieId, quantity * veggie.veggiesQuantity);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateSauce = async (sauceId, quantity) => {
  try {
    const sauceData = await PizzaSauce.findById(sauceId);
    // console.log(quantity);
    let updatedSauceQuantity = sauceData.sauceQuantity - quantity;
    if (isNaN(updatedSauceQuantity) || updatedSauceQuantity < 0) {
      updatedSauceQuantity = 0;
    }
    sauceData.sauceQuantity = updatedSauceQuantity;
    await sauceData.save();
    if (updatedSauceQuantity < 100) {
      console.log(
        `Updated sauce: ${sauceData.sauceName}, Updated Quantity: ${updatedSauceQuantity}`
      );
    }
  } catch (error) {
    console.log("Error updating sauce:", error);
    throw error;
  }
};

const updateCheese = async (cheeseId, quantity) => {
  try {
    const cheeseData = await PizzaCheese.findById(cheeseId);
    // console.log(quantity);
    let updatedCheeseQuantity = cheeseData.cheeseQuantity - quantity;
    if (isNaN(updatedCheeseQuantity) || updatedCheeseQuantity < 0) {
      updatedCheeseQuantity = 0;
    }
    cheeseData.cheeseQuantity = updatedCheeseQuantity;
    await cheeseData.save();
    if (updatedCheeseQuantity < 100) {
      console.log(
        `Updated cheese: ${cheeseData.cheeseName}, Updated Quantity: ${updatedCheeseQuantity}`
      );
    }
  } catch (error) {
    console.log("Error updating cheese:", error);
    throw error;
  }
};

const updateCheeseHandler = async (pizzaId, quantity) => {
  try {
    const pizzaData = await Pizza.findById(pizzaId);
    pizzaData.toppings.cheese.map(async (cheese) => {
      await updateCheese(cheese.cheeseId, quantity * cheese.cheeseQuantity);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateMeat = async (meatId, quantity) => {
  try {
    const meatData = await PizzaMeat.findById(meatId);
    // console.log(quantity);
    let updatedMeatQuantity = meatData.meatQuantity - quantity;
    if (isNaN(updatedMeatQuantity) || updatedMeatQuantity < 0) {
      updatedMeatQuantity = 0;
    }
    meatData.meatQuantity = updatedMeatQuantity;
    await meatData.save();
    if (updatedMeatQuantity < 100) {
      console.log(
        `Updated meat: ${meatData.meatName}, Updated Quantity: ${updatedMeatQuantity}`
      );
    }
  } catch (error) {
    console.log("Error updating meat:", error);
    throw error;
  }
};

const updateMeatHandler = async (pizzaId, quantity) => {
  try {
    const pizzaData = await Pizza.findById(pizzaId);
    pizzaData.toppings.meat.map(async (meat) => {
      await updateMeat(meat.meatId, quantity * meat.meatQuantity);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const updateSauceHandler = async (pizzaId, quantity) => {
  try {
    const pizzaData = await Pizza.findById(pizzaId);
    await updateSauce(
      pizzaData.sauce.sauceId,
      quantity * pizzaData.sauce.sauceQuantity
    );
  } catch (error) {
    console.log(error.message);
  }
};

const getInsufficientBase = async () => {
  try {
    const baseData = await PizzaBase.find({});
    const insufficientBases = baseData.filter(
      (base) =>
        base.smallQuantity <= 20 ||
        base.mediumQuantity <= 20 ||
        base.largeQuantity <= 20
    );
    const result = insufficientBases.map((base) => {
      const baseQuantity = {};
      if (base.smallQuantity <= 20) {
        baseQuantity.small = base.smallQuantity;
      }
      if (base.mediumQuantity <= 20) {
        baseQuantity.medium = base.mediumQuantity;
      }
      if (base.largeQuantity <= 20) {
        baseQuantity.large = base.largeQuantity;
      }
      return {
        baseName: base.baseName,
        baseQuantity,
      };
    });
    return result;
  } catch (error) {
    console.log("Error retrieving insufficient bases:", error);
    throw error;
  }
};

const getInsufficientVeggies = async () => {
  try {
    const veggieData = await PizzaVeggies.find({});
    const insufficientVeggies = veggieData.filter(
      (veggie) => veggie.veggiesQuantity < 100
    );
    const result = insufficientVeggies.map((veggie) => ({
      veggieName: veggie.veggiesName,
      veggieQuantity: veggie.veggiesQuantity,
    }));
    return result;
  } catch (error) {
    console.log("Error retrieving insufficient veggies:", error);
    throw error;
  }
};
const getInsufficientSauces = async () => {
  try {
    const sauceData = await PizzaSauce.find({});
    const insufficientSauces = sauceData.filter(
      (sauce) => sauce.sauceQuantity < 100
    );
    const result = insufficientSauces.map((sauce) => ({
      sauceName: sauce.sauceName,
      sauceQuantity: sauce.sauceQuantity,
    }));
    return result;
  } catch (error) {
    console.log("Error retrieving insufficient sauces:", error);
    throw error;
  }
};

const getInsufficientCheeses = async () => {
  try {
    const cheeseData = await PizzaCheese.find({});
    const insufficientCheeses = cheeseData.filter(
      (cheese) => cheese.cheeseQuantity < 50
    );
    const result = insufficientCheeses.map((cheese) => ({
      cheeseName: cheese.cheeseName,
      cheeseQuantity: cheese.cheeseQuantity,
    }));
    return result;
  } catch (error) {
    console.log("Error retrieving insufficient cheeses:", error);
    throw error;
  }
};

const getInsufficientMeats = async () => {
  try {
    const meatData = await PizzaMeat.find({});
    const insufficientMeats = meatData.filter((meat) => meat.meatQuantity < 50);
    const result = insufficientMeats.map((meat) => ({
      meatName: meat.meatName,
      meatQuantity: meat.meatQuantity,
    }));
    return result;
  } catch (error) {
    console.log("Error retrieving insufficient meats:", error);
    throw error;
  }
};

const updateStocks = async (orderId) => {
  try {
    const items = await getOrderDetails(orderId);
    items.map(async (item) => {
      await updateBaseHandler(item.pizzaId, item.size, item.quantity);
    });
    items.map(
      async (item) => await updateVeggiesHandler(item.pizzaId, item.quantity)
    );
    items.map(async (item) => {
      await updateSauceHandler(item.pizzaId, item.quantity);
    });
    items.map(
      async (item) => await updateCheeseHandler(item.pizzaId, item.quantity)
    );
    items.map(
      async (item) => await updateMeatHandler(item.pizzaId, item.quantity)
    );
  } catch (error) {
    console.log("Error updating stocks:", error);
    throw error;
  }
};

const sendInsufficientStockMail = async (insufficientData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Prepare the email content using the insufficientData parameter
    const mailContent = `
    <h2>Insufficient Stock Report</h2>
    <h3>Insufficient Bases:</h3>
    <ul>
      ${
        insufficientData.insufficientBases.length > 0
          ? insufficientData.insufficientBases
              .map(
                (base) => `
                  <li>Base Name: ${base.baseName}</li>
                  Base Quantity: ${JSON.stringify(base.baseQuantity)}
                `
              )
              .join("")
          : "<li>No insufficient bases</li>"
      }
    </ul>
    <h3>Insufficient Sauces:</h3>
    <ul>
      ${
        insufficientData.insufficientSauces.length > 0
          ? insufficientData.insufficientSauces
              .map(
                (sauce) => `
                  <li>Sauce Name: ${sauce.sauceName}</li>
                  Sauce Quantity: ${sauce.sauceQuantity}
                `
              )
              .join("")
          : "<li>No insufficient sauces</li>"
      }
    </ul>
    <h3>Insufficient Veggies:</h3>
    <ul>
      ${
        insufficientData.insufficientVeggies.length > 0
          ? insufficientData.insufficientVeggies
              .map(
                (veggie) => `
                  <li>Veggie Name: ${veggie.veggieName}</li>
                  Veggie Quantity: ${veggie.veggieQuantity}
                `
              )
              .join("")
          : "<li>No insufficient veggies</li>"
      }
    </ul>
    <h3>Insufficient Cheese:</h3>
    <ul>
      ${
        insufficientData.insufficientCheeses.length > 0
          ? insufficientData.insufficientCheeses
              .map(
                (cheese) => `
                  <li>Cheese Name: ${cheese.cheeseName}</li>
                  Cheese Quantity: ${cheese.cheeseQuantity}
                `
              )
              .join("")
          : "<li>No insufficient cheese</li>"
      }
    </ul>
    <h3>Insufficient Meat:</h3>
    <ul>
      ${
        insufficientData.insufficientMeats.length > 0
          ? insufficientData.insufficientMeats
              .map(
                (meat) => `
                  <li>Meat Name: ${meat.meatName}</li>
                  Meat Quantity: ${meat.meatQuantity}
                `
              )
              .join("")
          : "<li>No insufficient meat</li>"
      }
    </ul>
  `;

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: "sauravkumar48736@gmail.com", // Replace with admin email address
      subject: "Insufficient Stock Report",
      html: mailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

router.post("/update-status", authenticate, async (req, res) => {
  const status = req.body.status;
  const orderId = req.body.orderId;
  if (status === "Order Delivered") {
    updateStocks(orderId);
    const insufficientBase = await getInsufficientBase();
    const insufficientSauce = await getInsufficientSauces();
    const insufficientVeggies = await getInsufficientVeggies();
    const insufficientMeat = await getInsufficientMeats();
    const insufficientCheese = await getInsufficientCheeses();

    // Create the insufficientData object
    const insufficientData = {
      insufficientBases: insufficientBase,
      insufficientSauces: insufficientSauce,
      insufficientVeggies: insufficientVeggies,
      insufficientMeats: insufficientMeat,
      insufficientCheeses: insufficientCheese,
    };

    // Send the email with the insufficient data
    sendInsufficientStockMail(insufficientData);
  }

  try {
    const upDatedData = await Order.findByIdAndUpdate(orderId, {
      $set: { orderStatus: status },
    });

    //emitt event
    const eventEmitter = req.app.get("eventEmitter");
    eventEmitter.emit("orderUpdated", { id: orderId, status: status });

    return res.status(200).json({ msg: "Status Updated Successfully" });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

module.exports = router;
