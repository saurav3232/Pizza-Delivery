import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndiPizzaCard from "./IndiPizzaCard.component";
import LoadingComponent from "../Loading/Loading.component";
import { getVegPizza, getNonVegPizza } from "./PizzaManagmentApiCall";
import AddPizzaComp from "./AddPizza.component";
const ManagePizza = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("pizzza")) {
      navigate("/users/login");
    }
    // eslint-disable-next-line
  }, []);

  const [vegPizzaArr, setVegPizzaArr] = useState([]);
  const [nonVegPizzaArr, setNonVegPizzaArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  useEffect(() => {
    getVegPizza().then((res) => {
      setVegPizzaArr(res);
    });
    getNonVegPizza().then((res) => {
      setNonVegPizzaArr(res);
    });
    setLoading(false);
  }, []);
  return (
    <>
      {!loading ? (
        <div className="container-fluid text-center">
          <button className="btn btn-primary" onClick={handleShow}>
            Add New Pizza
          </button>
          {/* {console.log(vegPizzaArr)} */}
          {/* {console.log(nonVegPizzaArr)} */}
          <AddPizzaComp
            showModal={show}
            setShowModal={setShow}
            setVegPizzaArr={setVegPizzaArr}
            setNonVegPizzaArr={setNonVegPizzaArr}
          />
          <div className="container-fluid text-center">
            <div className="row">
              <h1 style={{ color: "white" }}>Veg Pizzas</h1>
              {vegPizzaArr.map((pizzaDetails, idx) => (
                <div className="col-sm mb-3" key={idx}>
                  <IndiPizzaCard
                    pizzaDetails={pizzaDetails}
                    setVegPizzaArr={setVegPizzaArr}
                    setNonVegPizzaArr={setNonVegPizzaArr}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="nonVeg-pizza container-fluid text-center">
            <div className="row">
              <h1 style={{ color: "white" }}>Non-Veg Pizzas</h1>
              {nonVegPizzaArr.map((pizzaDetails, idx) => (
                <div className="col-sm mb-3" key={idx}>
                  <IndiPizzaCard
                    pizzaDetails={pizzaDetails}
                    setVegPizzaArr={setVegPizzaArr}
                    setNonVegPizzaArr={setNonVegPizzaArr}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ManagePizza;
