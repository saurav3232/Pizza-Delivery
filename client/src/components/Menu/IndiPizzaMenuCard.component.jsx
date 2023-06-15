import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../../Contexts/CartContext";

const IndiPizzaMenuCard = (props) => {
  const pizzaData = props.pizzaDetails;
  const [selectedSize, setSelectedSize] = useState("DEFAULT");
  const { updateItemCount, handleAddToCart, handleRemoveFromCart } = useContext(
    CartContext
  );
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const response = updateItemCount(pizzaData);
    setItemCount(response);
    //eslint-disable-next-line
  }, []);

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleAddToCartClick = () => {
    handleAddToCart(pizzaData, selectedSize);
    setItemCount(updateItemCount(pizzaData));
  };

  const handleRemoveFromCartClick = () => {
    handleRemoveFromCart(pizzaData);
    setItemCount(updateItemCount(pizzaData));
  };

  return (
    <>
      <div className="card" style={{ maxWidth: "fit-content" }}>
        <div style={{ position: "relative" }}>
          <img
            src={pizzaData.pizzaAvatar}
            className="card-img-top"
            style={{ maxHeight: "6rem" }}
            alt="Pizza Pic"
          />
        </div>
        <div className="card-body">
          <h4 className="card-title">{pizzaData.pizzaName}</h4>
          <h5>
            <u>Toppings</u>:
          </h5>
          <p className="card-text d-flex flex-wrap mb-0">
            {pizzaData.toppings.veggies &&
              pizzaData.toppings.veggies.map((veggiesObj, idx) => (
                <span key={idx}>{veggiesObj.veggieName},</span>
              ))}
            {pizzaData.toppings.cheese &&
              pizzaData.toppings.cheese.map((cheeseObj, idx) => (
                <span key={idx}>{cheeseObj.cheeseName},</span>
              ))}
            {pizzaData.toppings.meat &&
              pizzaData.toppings.meat.map((meatObj, idx) => (
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
          <div className="d-flex align-items-center mt-2">
            {itemCount === 0 ? (
              <button className="btn btn-primary" onClick={handleAddToCartClick}>
                Add to Cart
              </button>
            ) : (
              <>
                <button className="btn btn-secondary me-2" onClick={handleRemoveFromCartClick}>
                  -
                </button>
                <span>{itemCount}</span>
                <button className="btn btn-secondary ms-2" onClick={handleAddToCartClick}>
                  +
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndiPizzaMenuCard;
