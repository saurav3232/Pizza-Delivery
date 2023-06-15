import React from "react";
import "./home.styles.css";
import {Link} from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="container-fluid h-100 m-10">
        <h1 className="d-flex w-100 homeHeading">Pizza Lovers</h1>
        <h1 className="homeHeading w-50">Your Destination has Arrived</h1>
      </div>
      <div className="w-100 d-flex flex-wrap  buttonContainer">
        <Link to="/users/menu">

        <button className="btn btn-danger btn-lg orderNow ">Order Now</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
