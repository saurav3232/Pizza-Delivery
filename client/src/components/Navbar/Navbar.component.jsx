import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
const NavbarComp = () => {
  // const [user, setUser] = useState(null);
  const {currentUser,setCurrentUser}=useContext(UserContext);
  const navigate = useNavigate();
  let clickLogOut = async () => {
    localStorage.removeItem("pizzza");
    setCurrentUser(null); // Reset the user state
    navigate("/users/login");
  };
  return (
    <>
      {console.log(currentUser)}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Navbar
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
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              {currentUser ? (
                <li className="nav-item">
                  <Link to="/" className="nav-link" onClick={clickLogOut}>
                    LogOut
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/users/login">
                    SignIn/Up
                  </Link>
                </li>
              )}
              {currentUser && currentUser.isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Inventory
                  </Link>
                </li>
              )}
            </ul>
            <li className="nav-item" style={{ listStyle: "none" }}>
              <Link className="nav-link active" aria-current="page" to="/">
                My Profile
              </Link>
            </li>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarComp;
