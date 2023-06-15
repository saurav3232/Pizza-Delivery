import React, { useState, useEffect } from "react";
import { MDBCheckbox } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import { getVegPizza, getNonVegPizza } from "./PizzaManagmentApiCall";
import {
  getPizzaBase,
  getPizzaSauce,
  getPizzaVeggies,
  getPizzaMeat,
  getPizzaCheese,
} from "./PizzaManagmentApiCall";

const AddPizzaCompCustomer = (props) => {
  const [pizzaBaseArr, setPizzaBaseArr] = useState([]);
  const [veggiesArr, setVeggiesArr] = useState([]);
  const [pizzaSauceArr, setPizzaSauceArr] = useState([]);
  const [meatArr, setMeatArr] = useState([]);
  const [cheeseArr, setCheeseArr] = useState([]);
  const { setVegPizzaArr, setNonVegPizzaArr } = props;
  const [pizzaformData, setPizzaFormData] = useState({
    pizzaName: "",
    pizzaDescription: "",
    pizzaAvatar: "",
    category: "",
    toppings: {
      veggies: [],
      meat: [],
      cheese: [],
    },
    sauce: {},
    base: {},
    price: {},
  });

  const [selectedToppings, setSelectedToppings] = useState({
    veggies: [],
    meat: [],
    cheese: [],
  });

  const [toppingsQuantities, setToppingsQuantities] = useState({
    veggies: [],
    meat: [],
    cheese: [],
  });
  //eslint-disable-next-line
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  //eslint-disable-next-line
  const [sauceQuantity, setSauceQuantity] = useState("");
  const [pizzaPrice, setPizzaPrice] = useState({
    smallPizza:  0,
    mediumPizza:  0,
    largePizza:  0,
  });
  const onChangePizzaPrice = (e) => {
    const { name, value } = e.target;
    setPizzaPrice((prevPrice) => ({
      ...prevPrice,
      [name]: value,
    }));
    setPizzaFormData((prevData) => ({
      ...prevData,
      price: {
        ...prevData.price,
        [name]: Number(value),
      },
    }));
  };

  const handleChangePizzaDetails = (e) => {
    setPizzaFormData({
      ...pizzaformData,
      [e.target.name]: e.target.value,
    });

    // console.log(pizzaformData);
  };

  const handleBaseChange = (baseIndex) => {
    // console.log(baseIndex);
    setSelectedBase(baseIndex);
    setPizzaFormData((prevData) => ({
      ...prevData,
      base: {
        baseId: pizzaBaseArr[baseIndex]._id,
        baseName: pizzaBaseArr[baseIndex].baseName,
      },
    }));
    // console.log(pizzaformData);
  };
  const handleSauceChange = (index) => {
    setSelectedSauce(index);
    const { _id, sauceName } = pizzaSauceArr[index];
    const updatedPizzaFormData = {
      ...pizzaformData,
      sauce: {
        sauceId: _id,
        sauceName: sauceName,
        sauceQuantity: "",
      },
    };

    setPizzaFormData(updatedPizzaFormData);
  };
  const handleSauceQuantityChange = (event) => {
    const sauceQuantity = event.target.value;
    const updatedPizzaFormData = {
      ...pizzaformData,
      sauce: {
        ...pizzaformData.sauce,
        sauceQuantity: sauceQuantity,
      },
    };
    setPizzaFormData(updatedPizzaFormData);
  };

  const handleToppingChange = (toppingObj, idx, category) => {
    const isSelected = selectedToppings[category].includes(idx);
    let updatedSelectedToppings = { ...selectedToppings };
    let updatedToppingsQuantities = { ...toppingsQuantities };

    if (isSelected) {
      const index = updatedSelectedToppings[category].indexOf(idx);
      updatedSelectedToppings[category].splice(index, 1);
      updatedToppingsQuantities[category].splice(index, 1);
    } else {
      updatedSelectedToppings[category].push(idx);
      updatedToppingsQuantities[category].push("");
    }

    setSelectedToppings(updatedSelectedToppings);
    setToppingsQuantities(updatedToppingsQuantities);
    setPizzaFormData((prevData) => {
      const updatedToppings = {
        veggies: updatedSelectedToppings.veggies.map((veggieIdx) => ({
          veggieId: veggiesArr[veggieIdx]._id,
          veggieName: veggiesArr[veggieIdx].veggiesName,
          veggiesQuantity: updatedToppingsQuantities.veggies[veggieIdx] || "",
        })),
        meat: updatedSelectedToppings.meat.map((meatIdx) => ({
          meatId: meatArr[meatIdx]._id,
          meatName: meatArr[meatIdx].meatName,
          meatQuantity: updatedToppingsQuantities.meat[meatIdx] || "",
        })),
        cheese: updatedSelectedToppings.cheese.map((cheeseIdx) => ({
          cheeseId: cheeseArr[cheeseIdx]._id,
          cheeseName: cheeseArr[cheeseIdx].cheeseName,
          cheeseQuantity: updatedToppingsQuantities.cheese[cheeseIdx] || "",
        })),
      };

      return {
        ...prevData,
        toppings: updatedToppings,
      };
    });
  };

  const handleToppingsQuantityChange = (e, idx, category) => {
    const updatedToppingsQuantities = { ...toppingsQuantities };
    updatedToppingsQuantities[category][idx] = e.target.value;

    setToppingsQuantities(updatedToppingsQuantities);

    setPizzaFormData((prevData) => ({
      ...prevData,
      toppings: {
        ...prevData.toppings,
        veggies: selectedToppings.veggies.map((veggieIdx) => {
          if (veggieIdx === idx) {
            return {
              ...prevData.toppings.veggies[veggieIdx],
              veggiesQuantity: e.target.value,
            };
          }
          return prevData.toppings.veggies[veggieIdx];
        }),
        meat: selectedToppings.meat.map((meatIdx) => ({
          meatId: meatArr[meatIdx]._id,
          meatName: meatArr[meatIdx].meatName,
          meatQuantity: toppingsQuantities.meat[meatIdx],
        })),
        cheese: selectedToppings.cheese.map((cheeseIdx) => ({
          cheeseId: cheeseArr[cheeseIdx]._id,
          cheeseName: cheeseArr[cheeseIdx].cheeseName,
          cheeseQuantity: toppingsQuantities.cheese[cheeseIdx],
        })),
      },
    }));
  };

  useEffect(() => {
    getPizzaBase().then((res) => {
      setPizzaBaseArr(res);
    });
    getPizzaSauce().then((res) => {
      setPizzaSauceArr(res);
    });
    getPizzaVeggies().then((res) => {
      setVeggiesArr(res);
    });
    getPizzaMeat().then((res) => {
      setMeatArr(res);
    });
    getPizzaCheese().then((res) => {
      setCheeseArr(res);
    });
  }, []);

  const show = props.showModal;
  const setShow = props.setShowModal;
  const handleClose = async () => {
    console.log(pizzaformData);
    if (pizzaformData.category === "") {
      Swal.fire("Category is required", "", "error");
      return;
    }
    if (pizzaformData.toppings.cheese.length === 0) {
      Swal.fire("Select At least One Cheese item", "", "error");
      return;
    }
    if (pizzaformData.category === "veg") {
      if (pizzaformData.toppings.veggies.length === 0) {
        Swal.fire("Select At least One veggie", "", "error");
        return;
      }
      if (pizzaformData.toppings.meat.length > 0) {
        Swal.fire("Cannot Select meat in veg pizza", "", "error");
        return;
      }
    }
    if (pizzaformData.category === "nonVeg") {
      if (pizzaformData.toppings.meat.length === 0) {
        Swal.fire("Select At least One meat item", "", "error");
        return;
      }
    }
    if (Object.keys(pizzaformData.base).length === 0) {
      Swal.fire("Please Select a pizza base", "", "error");
      return;
    }
    if (Object.keys(pizzaformData.sauce).length === 0) {
      Swal.fire("Please Select a pizza sauce", "", "error");
      return;
    }
    const { status } = await axios.post(
      "http://localhost:5000/api/admin/manage-pizza/addpizza",
      pizzaformData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      let vegPizzaArrayData = await getVegPizza();
      setVegPizzaArr(vegPizzaArrayData);
      let nonVegPizzaArrayData = await getNonVegPizza();
      setNonVegPizzaArr(nonVegPizzaArrayData);
    }
    setShow(false);
  };
  
  return (
    <>
    {console.log(pizzaformData)}
      <Modal show={show} onHide={() => setShow(false)} scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Add Pizza</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto" }}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Pizza Name
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Pizza Name"
              aria-label="pizzaName"
              aria-describedby="basic-addon1"
              value={pizzaformData.pizzaName}
              onChange={handleChangePizzaDetails}
              name="pizzaName"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Pizza Description
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Pizza Description"
              aria-label="pizzaDescription"
              aria-describedby="basic-addon1"
              value={pizzaformData.pizzaDescription}
              onChange={handleChangePizzaDetails}
              name="pizzaDescription"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Pizza Image
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter the URL for Pizza Image"
              aria-label="pizzaAvatar"
              aria-describedby="basic-addon1"
              value={pizzaformData.pizzaAvatar}
              onChange={handleChangePizzaDetails}
              name="pizzaAvatar"
            />
          </div>
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Category:
          </h5>
          <div className="d-flex">
            <div className="form-check mx-2">
              <input
                className="form-check-input"
                type="radio"
                id="veg"
                name="category"
                value="veg"
                onChange={handleChangePizzaDetails}
              />
              <label className="form-check-label" htmlFor="veg">
                Veg
              </label>
            </div>
            <div className="form-check mx-2">
              <input
                className="form-check-input"
                type="radio"
                id="nonveg"
                name="category"
                value="nonVeg"
                onChange={handleChangePizzaDetails}
              />
              <label className="form-check-label" htmlFor="nonveg">
                NonVeg
              </label>
            </div>
          </div>
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Veggies:
          </h5>
          {veggiesArr.map((veggiesObj, idx) => (
            <div key={idx} className="d-flex align-items-center">
              <MDBCheckbox
                name="inlineCheck"
                id={`inlineCheckbox${idx}`}
                value={veggiesObj}
                label={veggiesObj.veggiesName}
                onChange={() => handleToppingChange(veggiesObj, idx, "veggies")}
              />
              {selectedToppings.veggies.includes(idx) && (
                <div className="d-flex flex-column">
                  <input
                    type="number"
                    className="form-control mx-2"
                    placeholder="Quantity"
                    value={toppingsQuantities.veggies[idx] || ""}
                    onChange={(e) =>
                      handleToppingsQuantityChange(e, idx, "veggies")
                    }
                    required
                    min="0"
                    max={veggiesObj.veggiesQuantity}
                  />
                  {(toppingsQuantities.veggies[idx] === "" ||
                    toppingsQuantities.veggies[idx] >
                      veggiesObj.veggiesQuantity) && (
                    <span className="text-danger">
                      {toppingsQuantities.veggies[idx] === ""
                        ? "Quantity cannot be empty"
                        : `Quantity cannot exceed ${veggiesObj.veggiesQuantity}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Meat:
          </h5>
          {meatArr.map((meatObj, idx) => (
            <div key={idx} className="d-flex flex-wrap align-items-center ">
              <MDBCheckbox
                name="inlineCheck"
                id={`inlineCheckboxMeat${idx}`}
                value={meatObj}
                label={meatObj.meatName}
                onChange={() => handleToppingChange(meatObj, idx, "meat")}
              />
              {selectedToppings.meat.includes(idx) && (
                <div className="d-flex flex-column">
                  <input
                    type="number"
                    className="form-control mx-2"
                    placeholder="Quantity"
                    value={toppingsQuantities.meat[idx]}
                    onChange={(e) =>
                      handleToppingsQuantityChange(e, idx, "meat")
                    }
                    required
                    min="0"
                    max={meatObj.meatQuantity}
                  />
                  {(toppingsQuantities.meat[idx] === "" ||
                    toppingsQuantities.meat[idx] > meatObj.meatQuantity) && (
                    <span className="text-danger">
                      {toppingsQuantities.meat[idx] === ""
                        ? "Quantity cannot be empty"
                        : `Quantity cannot exceed ${meatObj.meatQuantity}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Cheese:
          </h5>
          {cheeseArr.map((cheeseObj, idx) => (
            <div key={idx} className="d-flex flex-wrap align-items-center">
              <MDBCheckbox
                name="inlineCheck"
                id={`inlineCheckboxCheese${idx}`}
                value={cheeseObj}
                label={cheeseObj.cheeseName}
                onChange={() => handleToppingChange(cheeseObj, idx, "cheese")}
              />
              {selectedToppings.cheese.includes(idx) && (
                <div className="d-flex flex-column">
                  <input
                    type="number"
                    className="form-control mx-2"
                    placeholder="Quantity"
                    value={toppingsQuantities.cheese[idx]}
                    onChange={(e) =>
                      handleToppingsQuantityChange(e, idx, "cheese")
                    }
                    required
                    min="0"
                    max={cheeseObj.cheeseQuantity}
                  />
                  {(toppingsQuantities.cheese[idx] === "" ||
                    toppingsQuantities.cheese[idx] >
                      cheeseObj.cheeseQuantity) && (
                    <span className="text-danger">
                      {toppingsQuantities.cheese[idx] === ""
                        ? "Quantity cannot be empty"
                        : `Quantity cannot exceed ${cheeseObj.cheeseQuantity}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Pizza Base:
          </h5>
          {pizzaBaseArr.map((baseObj, index) => (
            <div
              key={baseObj._id}
              className="form-check d-flex justify-content-start"
            >
              <input
                className="form-check-input"
                type="radio"
                name="base"
                id={`base${baseObj._id}`}
                value={baseObj._id}
                onChange={() => handleBaseChange(index)}
              />
              <label
                className="form-check-label"
                htmlFor={`base${baseObj._id}`}
              >
                {baseObj.baseName}
              </label>
            </div>
          ))}
          <h5 className="mt-3 d-flex flex-wrap justify-content-start">
            Choose Pizza Sauce:
          </h5>
          {pizzaSauceArr.map((sauceObj, index) => (
            <div
              key={sauceObj._id}
              className="form-check d-flex justify-content-start"
            >
              <input
                className="form-check-input"
                type="radio"
                name="sauce"
                id={`sauce${sauceObj._id}`}
                value={sauceObj._id}
                onChange={() => handleSauceChange(index)}
              />
              <label
                className="form-check-label"
                htmlFor={`sauce${sauceObj._id}`}
              >
                {sauceObj.sauceName}
              </label>
              {selectedSauce === index && (
                <div className="d-flex flex-column">
                  <input
                    type="number"
                    className="form-control mx-2"
                    placeholder="Sauce Quantity(ml)"
                    value={pizzaformData.sauce.sauceQuantity}
                    onChange={handleSauceQuantityChange}
                    name="sauceQuantity"
                    min="0"
                    max={sauceObj.sauceQuantity}
                  />
                  {(pizzaformData.sauce.sauceQuantity === "" ||
                    parseInt(pizzaformData.sauce.sauceQuantity) >
                      sauceObj.sauceQuantity) && (
                    <span className="text-danger">
                      {pizzaformData.sauce.sauceQuantity === ""
                        ? "Quantity cannot be empty"
                        : `Quantity must be less than or equal to ${sauceObj.sauceQuantity}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Small Pizza Price
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Small Pizza Price"
              aria-label="smallPizza"
              aria-describedby="basic-addon1"
              value={pizzaPrice.smallPizza}
              onChange={onChangePizzaPrice}
              name="smallPizza"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Medium Pizza Price
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Medium Pizza Price"
              aria-label="pizzaPrice"
              aria-describedby="basic-addon1"
              value={pizzaPrice.mediumPizza}
              onChange={onChangePizzaPrice}
              name="mediumPizza"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              Large Pizza Price
            </span>
            <input
              type="number"
              className="form-control"
              placeholder="Large Pizza Price"
              aria-label="pizzaPrice"
              aria-describedby="basic-addon1"
              value={pizzaPrice.largePizza}
              onChange={onChangePizzaPrice}
              name="largePizza"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddPizzaCompCustomer;
