import React, { useState, useContext, useEffect } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCard,
  MDBCardHeader,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { UserContext } from "../../Contexts/UserContext";

const PlaceOrder = (props) => {
  const {
    scrollableModal,
    setScrollableModal,
    deliveryLocation,
    setDeliveryLocation,
    contact,
    setContact,
    setShowDeliveryAddress,
    setShowContact
  } = props;

  const [addressArr, setAddressArr] = useState([]);
  const [useDeliveryLocation, setUseDeliveryLocation] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      setAddressArr(currentUser.address);
      setContact(currentUser.contact);
    }
  }, [currentUser]);

  const handleAddressChange = (addressObj) => {
    setDeliveryLocation(addressObj);
  };

  const handleCheckboxChange = (event) => {
    setUseDeliveryLocation(event.target.checked);
    setDeliveryLocation(null);
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setDeliveryLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  const saveDeliveryAndContact=()=>{
    setShowContact(true);
    setShowDeliveryAddress(true);
    setScrollableModal(!scrollableModal);
  }

  return (
    <>
      {/* {console.log(deliveryLocation)} */}
      <MDBModal
        show={scrollableModal}
        setShow={setScrollableModal}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Delivery and Contact</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setScrollableModal(!scrollableModal)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <h2>Select Address</h2>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={useDeliveryLocation}
                  onChange={handleCheckboxChange}
                  id="useDeliveryLocation"
                />
                <label
                  className="form-check-label"
                  htmlFor="useDeliveryLocation"
                >
                  Use existing delivery location
                </label>
              </div>
              {useDeliveryLocation ? (
                <div className="d-flex flex-row flex-wrap justify-content-between align-items-start">
                  {addressArr.map((addressObj, index) => (
                    <div
                      key={index}
                      className={`address-card ${
                        deliveryLocation === addressObj ? "active" : ""
                      }`}
                      onClick={() => handleAddressChange(addressObj)}
                    >
                      <div className="form-check">
                        <input
                          type="radio"
                          name="address"
                          value={addressObj}
                          checked={deliveryLocation === addressObj}
                          onChange={() => {}}
                          className="form-check-input"
                        />
                      </div>
                      <MDBCard>
                        <MDBCardHeader>Address {index + 1}</MDBCardHeader>
                        <MDBListGroup>
                          <MDBListGroupItem>
                            <label>
                              House/Flat Number: {addressObj.houseNumber}
                            </label>
                          </MDBListGroupItem>
                          <MDBListGroupItem>
                            <label>Road: {addressObj.road}</label>
                          </MDBListGroupItem>
                          <MDBListGroupItem>
                            <label>City: {addressObj.city}</label>
                          </MDBListGroupItem>
                          <MDBListGroupItem>
                            <label>Landmark: {addressObj.landmark}</label>
                          </MDBListGroupItem>
                          <MDBListGroupItem>
                            <label>Pincode: {addressObj.pincode}</label>
                          </MDBListGroupItem>
                        </MDBListGroup>
                      </MDBCard>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      House/Flat Number:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter house/flat number"
                      name="houseNumber"
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon2">
                      Road:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter road"
                      name="road"
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon3">
                      City:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city"
                      name="city"
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon4">
                      Landmark:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter landmark"
                      name="landmark"
                      onChange={handleFormInputChange}
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon5">
                      Pincode:
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter pincode"
                      name="pincode"
                      onChange={handleFormInputChange}
                    />
                  </div>
                </>
              )}
              <div className="input-group mb-3 mt-3">
                <span className="input-group-text" id="basic-addon5">
                  Contact
                </span>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={() => setScrollableModal(!scrollableModal)}
              >
                Close
              </MDBBtn>
              <MDBBtn onClick={saveDeliveryAndContact}>Save changes</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default PlaceOrder;
