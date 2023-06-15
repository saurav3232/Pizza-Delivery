import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import LoadingComponent from "../Loading/Loading.component";
import IndiPizzaMenuCard from "./IndiPizzaMenuCard.component";
import { UserContext } from "../../Contexts/UserContext";
const Menu = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    if (!currentUser) {
      navigate("/users/login");
    }
    //eslint-disable-next-line
  }, [currentUser]);
  const [vegPizzaArr, setVegPizzaArr] = useState([]);
  const [nonVegPizzaArr, setNonVegPizzaArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const getVegPizzas = async () => {
    let url = "http://localhost:5000/api/users/pizza-menu/getpizza/veg";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaData;
    } else {
      console.log(data.error);
      return;
    }
  };
  const getNonVegPizzas = async () => {
    let url = "http://localhost:5000/api/users/pizza-menu/getpizza/nonVeg";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaData;
    } else {
      console.log(data.error);
      return;
    }
  };

  useEffect(() => {
    if (currentUser) {
      getVegPizzas().then((res) => {
        setVegPizzaArr(res);
      });
      getNonVegPizzas().then((res) => {
        setNonVegPizzaArr(res);
      });
      setLoading(false);
    }
  }, []);

  return (
    <>
      {!loading ? (
        <div className="container-fluid">
          <h1 className="text-center mt-3" style={{ color: "white" }}>
            Pizza Menu
          </h1>

          <div className="container-fluid ">
            <div className="row">
              <h1 style={{ color: "white" }}>Veg Pizzas</h1>
              {vegPizzaArr.map((pizzaDetails, idx) => (
                <div className="col-sm mb-3" key={idx}>
                  <IndiPizzaMenuCard pizzaDetails={pizzaDetails} />
                </div>
              ))}
            </div>
          </div>
          <div className="nonVeg-pizza container-fluid ">
            <div className="row">
              <h1 style={{ color: "white" }}>Non-Veg Pizzas</h1>
              {nonVegPizzaArr.map((pizzaDetails, idx) => (
                <div className="col-sm mb-3" key={idx}>
                  <IndiPizzaMenuCard pizzaDetails={pizzaDetails} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
      );
    </>
  );
};

export default Menu;
