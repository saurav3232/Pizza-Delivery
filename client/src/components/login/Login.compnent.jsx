import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./login.styles.css";
import { UserContext } from "../../Contexts/UserContext";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const getUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      });
      setCurrentUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("pizzza")) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);
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

  let submitLogin = async (event) => {
    event.preventDefault();
    if (user.email !== "" && user.password !== "") {
      let email = user.email;
      let password = user.password;
      let url = "http://localhost:5000/api/users/login",
        requestData = { email, password };
      if (regAdmin) {
        url = "http://localhost:5000/api/users/admin-login";
        requestData = { email, password, secretKey };
      }
      const { status, data } = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (status === 201) {
        Swal.fire("Invalid credentials", "", "error");
      } else if (status === 200) {
        Swal.fire("Login successful", "", "success");
        localStorage.setItem("pizzza", data.token);
        getUser().then(() => {
          navigate("/");
        });
      } else if (status === 203) {
        Swal.fire("Email not verified", "", "error");
        return;
      } else if (status === 202) {
        Swal.fire("You are not authorized as admin", "", "error");
        return;
      } else if (status === 204) {
        Swal.fire(
          "You are registered as admin, please login as admin",
          "",
          "error"
        );
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
            Login to your account
          </h2>
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
              label="Login as Admin"
            />
          </div>
          <MDBRow>
            <MDBCol md="6">
              <MDBBtn className="mb-4 w-100 gradient-custom-3" size="lg">
                <Link to="/users/reset-password">Forget Password</Link>
              </MDBBtn>
            </MDBCol>
            <MDBCol md="6">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-4"
                size="lg"
                onClick={submitLogin}
              >
                Login
              </MDBBtn>
            </MDBCol>
          </MDBRow>

          <p>
            Don't have an account <Link to="/users/register">Register</Link>
          </p>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default Login;
