import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./register.styles.css";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
const Register = () => {
  const navigate = useNavigate();
  let [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  let [secretKey, setSecretKey] = useState("");

  let [userError, setUserError] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  let validateUsername = (event) => {
    setUser({ ...user, name: event.target.value });
    let regExp = /^[a-zA-Z0-9]/;
    !regExp.test(event.target.value)
      ? setUserError({ ...userError, nameError: "Enter a proper Username" })
      : setUserError({ ...userError, nameError: "" });
  };

  let validateEmail = (event) => {
    setUser({ ...user, email: event.target.value });
    let regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    !regExp.test(event.target.value) || event.target.value.trim() === ""
      ? setUserError({ ...userError, emailError: "Enter a proper Email" })
      : setUserError({ ...userError, emailError: "" });
  };

  let validatePassword = (event) => {
    setUser({ ...user, password: event.target.value });
    if (event.target.value.trim() === "")
      setUserError({ ...userError, passwordError: "Enter a proper Password" });
    else setUserError({ ...userError, passwordError: "" });
  };
  let [regAdmin, setregAdmin] = useState(false);

  let submitRegistration = async (event) => {
    event.preventDefault();
    console.log(user);
    if (user.name.trim() !== "" &&user.email.trim() !== "" &&user.password.trim() !== "")
     {
      let name = user.name.trim();
      let email = user.email.trim();
      let password = user.password.trim();
      let url="http://localhost:5000/api/users/register";
      let requestData={ name, email, password };
      if(regAdmin){
        url="http://localhost:5000/api/users/admin-register";
        requestData={ name, email, password ,secretKey}
      }
      const { status} = await axios.post(
        url,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(status);
      if (status === 201 ) {
        Swal.fire("user already exists", "", "error");
        return;
      }else if(status === 202 ){
        Swal.fire("Not Authorized as admin","","error")
        return;
      } 
      else if (status === 200) {
        Swal.fire("Please check your email for verification", "", "success");
        navigate("/users/login");
        setUser({
            name: "",
            email: "",
            password: "",
          })
          setSecretKey("");

      }
    //   console.log(user);
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
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          {userError.nameError.length > 0 ? (
            <small className="text-danger mb-1">{userError.nameError}</small>
          ) : (
            ""
          )}
          <MDBInput
            wrapperClass="mb-4"
            label="Your Name"
            value={user.name}
            size="lg"
            id="form1"
            type="text"
            onChange={validateUsername}
            className={`form-control  ${
              userError.nameError.length > 0 ? "is-invalid" : ""
            }`}
          />
          {userError.emailError.length > 0 ? (
            <small className="text-danger">{userError.emailError}</small>
          ) : (
            ""
          )}
          <MDBInput
            wrapperClass="mb-4"
            label="Your Email"
            size="lg"
            value={user.email}
            id="form2"
            type="email"
            onChange={validateEmail}
          />
          {userError.passwordError.length > 0 ? (
            <small className="text-danger">{userError.passwordError}</small>
          ) : (
            ""
          )}
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            size="lg"
            value={user.password}
            id="form3"
            type="password"
            onChange={validatePassword}
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
              label="Register as Admin"
            />
          </div>
          <MDBBtn
            className="mb-4 w-100 gradient-custom-4"
            size="lg"
            onClick={submitRegistration}
          >
            Register
          </MDBBtn>
            <p>Already Have an account <Link to ='/users/login'>Login</Link></p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Register;