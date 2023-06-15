import React, { useState } from "react";
import AddOrUpdatePizza from "./AddOrUpdatePizza.component";
import {getVegPizza,getNonVegPizza} from "./PizzaManagmentApiCall"
import Swal from "sweetalert2";
import axios from "axios";
const IndiPizzaCard = (props) => {
  const pizzaData = props.pizzaDetails;
  const { setVegPizzaArr, setNonVegPizzaArr } = props;
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const [selectedSize, setSelectedSize] = useState("DEFAULT");

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };
  const deletePizza = async () => {
    const { status } = await axios.delete(
      `http://localhost:5000/api/admin/manage-pizza/delete-pizza/${pizzaData._id}`,
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
    } else {
      Swal.fire("Something went Wrong", "", "error");
      return;
    }
  };
  return (
    <>
      {/* {console.log(pizzaData)} */}
      <div className="card" style={{ maxWidth: "fit-content" }}>
        <div style={{ position: "relative" }}>
          <img
            src={pizzaData.pizzaAvatar}
            className="card-img-top "
            style={{"maxHeight":"6rem" }}
            alt="Pizza Pic"
          />
          <div className="card-img-overlay" style={{ top: 0, left: 0 }}>
            <button
              className="btn btn-primary me-2 ms btn-sm"
              onClick={handleShow}
            >
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button className="btn btn-danger me-2 ms btn-sm" onClick={deletePizza}>
              <i className="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <h4 className="card-title">{pizzaData.pizzaName}</h4>
          <h5>
            <u>Toppings</u>:
          </h5>
          <p className="card-text d-flex justify-content-center flex-wrap mb-0">
            {pizzaData.toppings.veggies &&
              pizzaData.toppings.veggies.map((veggiesObj,idx) => (
                  (
                    <span key={idx}>
                      {veggiesObj.veggieName},
                    </span>
                  )
              ))}
            {pizzaData.toppings.cheese &&
              pizzaData.toppings.cheese.map((cheeseObj,idx) => (
                <span key={idx}>{cheeseObj.cheeseName},</span>
              ))}
            {pizzaData.toppings.meat &&
              pizzaData.toppings.meat.map((meatObj,idx) => (
                <span key={idx}>{meatObj.meatName},</span>
              ))}
          </p>
          <p className="mb-0">
            <u>Base</u>: {pizzaData.base.baseName}
          </p>
          <p className="mb-0">
            <u>Sauce</u>: {pizzaData.sauce.sauceName}
          </p>
          <select
            className="form-select"
            aria-label="Default select example"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option value="DEFAULT" disabled>
              Price
            </option>
            <option value="1">
              Small: &#8377;{pizzaData.price.smallPizza}
            </option>
            <option value="2">
              Medium: &#8377;{pizzaData.price.mediumPizza}
            </option>
            <option value="3">
              Large: &#8377;{pizzaData.price.largePizza}
            </option>
          </select>
        </div>
      </div>
      <AddOrUpdatePizza
        pizzaDetails={pizzaData}
        showModal={show}
        setShowModal={setShow}
        setVegPizzaArr={setVegPizzaArr}
        setNonVegPizzaArr={setNonVegPizzaArr}
      />
    </>
  );
};

export default IndiPizzaCard;
