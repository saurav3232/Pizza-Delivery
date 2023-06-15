import React from "react";
import { useState, useContext } from "react";
import "./indiCard.styles.css";
import axios from "axios";
import { UserContext } from "../../Contexts/UserContext";
import Swal from "sweetalert2";

const IndiAddressComp = (props) => {
  const addressObj = props.address;
  const idx = props.index;
  const renderAddAddress = props.renderAddAddress;
  // console.log(renderAddAddress);
  const { setCurrentUser } = useContext(UserContext);
  const [editingAddress, setEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    houseNumber: addressObj.houseNumber || "",
    road: addressObj.road || "",
    city: addressObj.city || "",
    landmark: addressObj.landmark || "",
    pincode: addressObj.pincode || "",
    uid: addressObj.uid || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "http://localhost:5000/api/users/profiles/update-address";
    let requestData = { formData };

    const { status, data } = await axios.put(url, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });

    if (status === 201) {
      Swal.fire("Oh no something went wrong", "", "error");
    } else {
      setCurrentUser(data.userData);
      setEditingAddress(!editingAddress);
    }
  };

  const deleteAddress = async () => {
    let url = "http://localhost:5000/api/users/profiles/delete-address";
    let requestData = { addressUid: addressObj.uid };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
      data: requestData,
    };

    try {
      const { status, data } = await axios.delete(url, config);

      if (status === 201) {
        Swal.fire("Oh no something went wrong", "", "error");
      } else {
        setCurrentUser(data.userData);
      }
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
    }
  };

  return (
    <>
      {/* {console.log(addressObj)} */}
      {editingAddress === false ? (
        <div className="card">
          <div className="card-header">Address: {idx + 1}</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              House/Flat no.: {addressObj.houseNumber}
            </li>
            <li className="list-group-item">Road: {addressObj.road}</li>
            <li className="list-group-item">City: {addressObj.city}</li>
            <li className="list-group-item">Landmark: {addressObj.landmark}</li>
            <li className="list-group-item">Pincode: {addressObj.pincode}</li>
            <li className="list-group-item">
              {renderAddAddress===undefined && (
                <>
                  <button
                    className="btn btn-primary me-2 ms-2 btn-sm"
                    // onClick={handleEditClick}
                    onClick={() => {
                      setEditingAddress(!editingAddress);
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger me-2 ms-2 btn-sm"
                    onClick={deleteAddress}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </>
              )}
            </li>
          </ul>
          <div className="indicard-btns"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon1"
            >
              House/Flat Number
            </span>
            <input
              type="text"
              className="form-control"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon2"
            >
              Road
            </span>
            <input
              type="text"
              className="form-control"
              id="road"
              name="road"
              value={formData.road}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon3"
            >
              City
            </span>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon4"
            >
              Landmark
            </span>
            <input
              type="text"
              className="form-control"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span
              className="input-group-text form-background"
              id="basic-addon5"
            >
              Pincode
            </span>
            <input
              type="text"
              className="form-control"
              id="pincode"
              name="pincode"
              value={formData.pincode}
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

export default IndiAddressComp;
