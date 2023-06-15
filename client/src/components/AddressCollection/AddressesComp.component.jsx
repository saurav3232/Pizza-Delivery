import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Contexts/UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import IndiAddressComp from "./IndiAddress.component";

const AddressesComp = (props) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [addressArr, setAddressArr] = useState([]);
  const renderAddAddress=props.renderAddAddress;
  // console.log(renderAddAddress);
  const [formData, setFormData] = useState({
    houseNumber: "",
    road: "",
    city: "",
    landmark: "",
    pincode: "",
    uid: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("pizzza")) {
      navigate("/users/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentUser) {
      setAddressArr(currentUser.address);
    }
    //eslint-disable-next-line
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const addNewAddress = async () => {
    let url = "http://localhost:5000/api/users/profiles/add-address";
    const address = { ...formData, uid: uuidv4() };
    // console.log(address);
    let requestData = { address: address };
    try {
      const { status, data } = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      });

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
    <div className="container-fluid text-center">
      {/* {console.log(addressArr)} */}
      {addressArr.length > 0 ? (
        <div>
          <h1 style={{ textAlign: "center",color:"azure" }} className="mb-5 mt-4">
            My Address
          </h1>
          <div className="container text-center">
            <div className="row ">
              {addressArr.map((addressObj, idx) => (
                <div className="col-sm mb-5" key={addressObj.uid}>
                  <IndiAddressComp address={addressObj} index={idx} renderAddAddress={renderAddAddress}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1 style={{ textAlign: "center" ,color:"azure"}} className="mb-5 mt-4">
          No saved Addresses
        </h1>
      )}
      {renderAddAddress===undefined && <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add New Address
      </button>}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Create New Address
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3 input-group">
                <span className="input-group-text" id="basic-addon1">
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
                <span className="input-group-text" id="basic-addon2">
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
                <span className="input-group-text" id="basic-addon3">
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
                <span className="input-group-text" id="basic-addon4">
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
                <span className="input-group-text" id="basic-addon5">
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={addNewAddress}
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesComp;
