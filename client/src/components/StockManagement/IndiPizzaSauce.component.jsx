import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const IndiPizzaSauceComp = (props) => {
  const pizzaSauceObj = props.pizzaSauceItem;
  const setPizzaSauceArrFun = props.setPizzaSauceArr;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    sauceName: pizzaSauceObj.sauceName || "",
    sauceQuantity: pizzaSauceObj.sauceQuantity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getPizzaSauce = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzasauce";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaSauce;
    } else {
      console.log(data.error);
      return;
    }
  };
  const deletePizzaBase = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/manage-stocks/delete/pizzasauce/${pizzaSauceObj._id}`,
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
        let pizzaData = await getPizzaSauce();
        setPizzaSauceArrFun(pizzaData);
      } else {
        Swal.fire("Error", "Failed to delete the pizza sauce", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the pizza sauce",
        "error"
      );
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const { status } = await axios.post(
      "http://localhost:5000/api/admin/manage-stocks/update/pizzasauce/" +
        pizzaSauceObj._id,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      const response = await getPizzaSauce();
      setPizzaSauceArrFun(response);
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
          <div className="card-header">{pizzaSauceObj.sauceName}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Pizza Sauce Quantity(ml):{pizzaSauceObj.sauceQuantity}
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
              Sauce Name
            </span>
            <input
              type="text"
              className="form-control"
              id="sauceName"
              name="sauceName"
              value={formData.sauceName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              Sauce Quantity(ml)
            </span>
            <input
              type="number"
              className="form-control"
              id="sauceQuantity"
              name="sauceQuantity"
              value={formData.sauceQuantity}
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

export default IndiPizzaSauceComp;
