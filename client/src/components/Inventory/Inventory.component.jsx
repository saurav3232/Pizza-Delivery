import React from "react";
import "./inventory.styles.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Inventory = () => {
  let navigate=useNavigate();
  useEffect(()=>{
    if(!localStorage.getItem("pizzza")){
      navigate("/users/login");
    }
  })
  return (
    <div className="inventory-container">
      <div className="container text-center">
        <div className="row ">
          <div className="col-sm indi-box"><Link to="/users/inventory/manage-orders">Manage Order</Link></div>
          <div className="col-sm indi-box"><Link to="/users/inventory/manage-stocks">Manage Stocks</Link></div>
          <div className="col-sm indi-box"><Link to="/users/inventory/manage-pizza">Manage Pizzas</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
