import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const IndiPizzaMeatComp = (props) => {
  const pizzaMeatObj = props.pizzaMeatItem;
  const setPizzaMeatArrFun = props.setPizzaMeatArr;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    meatName: pizzaMeatObj.meatName || "",
    meatQuantity: pizzaMeatObj.meatQuantity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getPizzaMeat = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzameat";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaMeat;
    } else {
      console.log(data.error);
      return;
    }
  };
  const deletePizzaMeat = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/manage-stocks/delete/pizzameat/${pizzaMeatObj._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
          },
        }
      );

      if (response.status === 200) {
        // Pizza base deleted successfully, you can perform any additional actions here
        console.log(response.status);
        let pizzaData = await getPizzaMeat();
        setPizzaMeatArrFun(pizzaData);
      } else {
        Swal.fire("Error", "Failed to delete the pizza cheese", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the pizza cheese",
        "error"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const { status } = await axios.post(
      "http://localhost:5000/api/admin/manage-stocks/update/pizzameat/" +
        pizzaMeatObj._id,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      const response = await getPizzaMeat();
      setPizzaMeatArrFun(response);
    } else {
      Swal.fire("Something went Wrong", "", "error");
      return;
    }
    setEditing(!editing);
  };
  return (
    <>
      {editing === false ? (
        <div className="card" style={{ maxWidth: "15rem", margin: "10px" }}>
          <div className="card-header">{pizzaMeatObj.meatName}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Pizza Meat Quantity(gm):{pizzaMeatObj.meatQuantity}
            </li>
            <li className="list-group-item">
              <button
                className="btn btn-primary me-2 ms-2 btn-sm"
                // onClick={handleEditClick}
                onClick={() => {
                  setEditing(!editing);
                }}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
              <button
                className="btn btn-danger me-2 ms-2 btn-sm"
                onClick={deletePizzaMeat}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              Meat Name
            </span>
            <input
              type="text"
              className="form-control"
              id="meatName"
              name="meatName"
              value={formData.meatName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              Meat Quantity(gm)
            </span>
            <input
              type="number"
              className="form-control"
              id="meatQuantity"
              name="meatQuantity"
              value={formData.meatQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-success btn-sm" type="submit">
            <i className="bi bi-check2"></i>
          </button>
        </form>
      )}
    </>
  );
};

export default IndiPizzaMeatComp;
