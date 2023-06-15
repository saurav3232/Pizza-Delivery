import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import "./navbarComp.styles.css";
import Swal from "sweetalert2";
import axios from "axios";
import { CartContext } from "../../Contexts/CartContext";
const NavbarComp = () => {
  // const [user, setUser] = useState(null);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const {setCartItems}=useContext(CartContext)
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingNumber, setEditingNumber] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const navigate = useNavigate();
  let clickLogOut = async () => {
    localStorage.removeItem("pizzza");
    localStorage.removeItem("pizzaCartItems");
    setCurrentUser(null); // Reset the user state
    setCartItems([]);
    navigate("/users/login");
  };
  useEffect(() => {
    if (currentUser) {
      setNewName(currentUser.name);
      setNewNumber(currentUser.contact);
    }
  }, [currentUser]);

  const updateName = async () => {
    if (newName === "") {
      Swal.fire("Name cannot be empty", "", "error");
      return;
    } else {
      let url = "http://localhost:5000/api/users/profiles/update-name",
        requestData = { newName: newName };
      const { status, data } = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      });
      if (status === 200) {
        console.log(data.userData);
        setCurrentUser(data.userData);
      } else {
        Swal.fire("Oh no something went wrong, Try agin later");
        return;
      }
    }
    setEditingName(!editingName);
  };

  const updateNumber = async () => {
    if (newNumber === "") {
      Swal.fire("Name cannot be empty", "", "error");
      return;
    } else {
      let url = "http://localhost:5000/api/users/profiles/update-number",
        requestData = { newNumber: newNumber };
      const { status, data } = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      });
      if (status === 200) {
        // console.log(data.userData);
        setCurrentUser(data.userData);
      } else {
        Swal.fire("Oh no something went wrong, Try agin later");
        return;
      }
    }
    setEditingNumber(!editingNumber);
  };

  return (
    <>
      {console.log(currentUser)}
      <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary w-100 bg-success navbar-default ">
        <div className="container-fluid">
          <Link className="navbar-brand nav-custom-color" to="/">
            Pizzza
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active nav-custom-color"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <Link
                      to="/users/menu"
                      className="nav-link nav-custom-color"
                    >
                      Menu
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link nav-custom-color"
                      onClick={clickLogOut}
                    >
                      LogOut
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link nav-custom-color" to="/users/login">
                    SignIn/Up
                  </Link>
                </li>
              )}
              {currentUser && currentUser.isAdmin && (
                <li className="nav-item">
                  <Link
                    className="nav-link nav-custom-color"
                    to="/users/inventory"
                  >
                    Inventory
                  </Link>
                </li>
              )}
            </ul>
            {currentUser && (
              <ul className="navbar-nav  mb-2 mb-lg-0">
                <li className="nav-item" style={{ listStyle: "none" }}>
                  <Link
                    className="nav-link nav-custom-color "
                    to="/users/cart"
                    
                  >
                    <i className="bi bi-cart-fill"></i>
                  </Link>
                </li>
                <li className="nav-item" style={{ listStyle: "none" }}>
                  <Link
                    className="nav-link nav-custom-color "
                    aria-current="page"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                  >
                    My Account
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
      {currentUser && (
        <div
          className="offcanvas offcanvas-end offcanvas-background"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasRightLabel">
              My Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="profile-img-container">
              <img
                src={currentUser.avatar}
                alt="userImg"
                className="img-fluid"
              />
            </div>
            <div className="profile-extras">
              <div className="profile-name mt-2">
                {editingName ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      console.log(newName);
                    }}
                  />
                ) : (
                  newName
                )}
                {editingName === false && (
                  <button
                    className="btn btn-danger me-2 ms-2 btn-sm"
                    onClick={() => {
                      setEditingName(!editingName);
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                )}
                {editingName && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={updateName}
                  >
                    <i className="bi bi-check2"></i>
                  </button>
                )}
              </div>
              <div className="profile-email mt-2">
                <i className="bi bi-envelope-fill">:{currentUser.email}</i>
              </div>
              <div className="profile-contact mt-2">
                <i className="bi bi-telephone-fill"></i>:
                {editingNumber ? (
                  <input
                    type="text"
                    value={newNumber}
                    onChange={(e) => {
                      setNewNumber(e.target.value);
                      // console.log(newName);
                    }}
                  />
                ) : (
                  newNumber
                )}
                {editingNumber === false && (
                  <button
                    className="btn btn-danger me-2 ms-2 btn-sm"
                    onClick={() => {
                      setEditingNumber(!editingNumber);
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                )}
                {editingNumber && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={updateNumber}
                  >
                    <i className="bi bi-check2"></i>
                  </button>
                )}
              </div>

              <Link className="mt-2 link-custom-color" to="/users/profile/myorders">My Orders</Link>
              <Link
                className="mt-2 link-custom-color"
                to="/users/profile/myaddresses"
              >
                My Addresses
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarComp;
