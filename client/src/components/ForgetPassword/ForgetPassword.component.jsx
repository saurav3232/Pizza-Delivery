import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../login/login.styles.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
const ForgetPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("pizzza")) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);
  let [userEmail, setUserEmail] = useState("");
  let [secretKey, setSecretKey] = useState("");

  let [userError, setUserError] = useState({
    emailError: "",
  });

  let validateEmail = (event) => {
    setUserEmail(event.target.value);
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value) || event.target.value.trim() === ""
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let [regAdmin, setregAdmin] = useState(false);

  let resetPassword = async (event) => {
    event.preventDefault();
    if (userEmail !== "") {
      let email = userEmail;
      let url = "http://localhost:5000/api/users/forget-password",
        requestData = { email };
      if (regAdmin) {
        url = "http://localhost:5000/api/users/admin/forget-password";
        requestData = { email, secretKey };
      }
      const { status} = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (status === 201) {
        Swal.fire("Please Verify your email first ", "", "error");
      } else if (status === 200) {
        Swal.fire(
          "Please Check Your email for Password Reset Link",
          "",
          "success"
        );
        navigate("/users/login");
      } else if (status === 203) {
        Swal.fire("Unidentified Secret Key", "", "error");
        return;
      } else if (status === 202) {
        Swal.fire("User Email is incorrect", "", "error");
        return;
      } else if (status === 204) {
        Swal.fire("You are not verified as an admin", "", "error");
        return;
      } else if (status === 205) {
        Swal.fire("You are not registered as admin", "", "error");
        return;
      }
    } else {
      Swal.fire("Oh no!", "Something went wrong! Try again", "error");
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ width: "600px" }}>
        <MDBCardBody className="px-5">
          <h2 className="text-uppercase text-center mb-5">
            Reset Your Password
          </h2>
          {userError.emailError.length > 0 ? (
            <small className="text-danger">{userError.emailError}</small>
          ) : (
            ""
          )}
          <MDBInput
            wrapperClass="mb-4"
            label="Registered Email"
            size="lg"
            value={userEmail}
            id="form2"
            type="email"
            onChange={validateEmail}
          />
          {regAdmin && (
            <MDBInput
              wrapperClass="mb-4"
              label="Enter Secret Key"
              size="lg"
              id="form4"
              type="password"
              onChange={(e) => {
                setSecretKey(e.target.value);
              }}
            />
          )}
          <div className="d-flex flex-row justify-content-center mb-4">
            <MDBCheckbox
              name="flexCheck"
              id="flexCheckDefault"
              value={regAdmin}
              onChange={() => {
                setregAdmin(!regAdmin);
              }}
              label="I am an Admin"
            />
          </div>
          <MDBBtn
            className="mb-4 w-100 gradient-custom-3"
            size="lg"
            onClick={resetPassword}
          >
            Send Reset Link
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default ForgetPassword;
