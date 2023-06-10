import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const IndiPizzaBaseComp = (props) => {
  const pizzaBaseObj = props.pizzaBaseItem;
  const setPizzaBaseArrFun = props.setPizzaBaseArr;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    baseName: pizzaBaseObj.baseName || "",
    smallQuantity: pizzaBaseObj.smallQuantity || "",
    mediumQuantity: pizzaBaseObj.mediumQuantity || "",
    largeQuantity: pizzaBaseObj.largeQuantity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getPizzaBase = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzabase";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaBases;
    } else {
      console.log(data.error);
      return;
    }
  };
  const deletePizzaBase = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/manage-stocks/delete/pizzabase/${pizzaBaseObj._id}`,
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
        let pizzaData = await getPizzaBase();
        setPizzaBaseArrFun(pizzaData);
      } else {
        Swal.fire("Error", "Failed to delete the pizza base", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the pizza base",
        "error"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const { status } = await axios.post(
      "http://localhost:5000/api/admin/manage-stocks/update/pizzabase/" +
        pizzaBaseObj._id,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      const response = await getPizzaBase();
      setPizzaBaseArrFun(response);
    } else {
      Swal.fire("Something went Wrong", "", "error");
      return;
    }
    setEditing(!editing);
  };
  return (
    <>
      
      {editing === false ? (
        <div className="card" style={{ maxWidth: "18rem", margin: "10px" }}>
          <div className="card-header">{pizzaBaseObj.baseName}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Small Pizza Base:{pizzaBaseObj.smallQuantity}
            </li>
            <li className="list-group-item">
              Medium Pizza Base:{pizzaBaseObj.mediumQuantity}
            </li>
            <li className="list-group-item">
              Large Pizza Base:{pizzaBaseObj.largeQuantity}
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
                onClick={deletePizzaBase}
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
              Base Name
            </span>
            <input
              type="text"
              className="form-control"
              id="baseName"
              name="baseName"
              value={formData.baseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              Small Quantity
            </span>
            <input
              type="text"
              className="form-control"
              id="smallQuantity"
              name="smallQuantity"
              value={formData.smallQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon2"
            >
              Medium Quantity
            </span>
            <input
              type="text"
              className="form-control"
              id="mediumQuantity"
              name="mediumQuantity"
              value={formData.mediumQuantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon3"
            >
              Large Quantity
            </span>
            <input
              type="text"
              className="form-control"
              id="largeQuantity"
              name="largeQuantity"
              value={formData.largeQuantity}
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

export default IndiPizzaBaseComp;
