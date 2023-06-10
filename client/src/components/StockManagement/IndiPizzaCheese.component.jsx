import React from "react";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const IndiPizzaCheeseComp = (props) => {
  const pizzaCheeseObj = props.pizzaCheeseItem;
  const setPizzaCheeseArrFun = props.setPizzaCheeseArr;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    cheeseName: pizzaCheeseObj.cheeseName || "",
    cheeseQuantity: pizzaCheeseObj.cheeseQuantity || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const getPizzaCheese = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzacheese";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaCheese;
    } else {
      console.log(data.error);
      return;
    }
  };
  const deletePizzaCheese = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/manage-stocks/delete/pizzacheese/${pizzaCheeseObj._id}`,
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
        let pizzaData = await getPizzaCheese();
        setPizzaCheeseArrFun(pizzaData);
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
      "http://localhost:5000/api/admin/manage-stocks/update/pizzacheese/" +
        pizzaCheeseObj._id,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      const response = await getPizzaCheese();
      setPizzaCheeseArrFun(response);
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
          <div className="card-header">{pizzaCheeseObj.cheeseName}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Pizza Cheese Quantity(gm):{pizzaCheeseObj.cheeseQuantity}
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
                onClick={deletePizzaCheese}
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
              Cheese Name
            </span>
            <input
              type="text"
              className="form-control"
              id="cheeseName"
              name="cheeseName"
              value={formData.cheeseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              Cheese Quantity(gm)
            </span>
            <input
              type="number"
              className="form-control"
              id="cheeseQuantity"
              name="cheeseQuantity"
              value={formData.cheeseQuantity}
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

export default IndiPizzaCheeseComp;
