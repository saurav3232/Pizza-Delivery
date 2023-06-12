import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavbarComp from "./components/Navbar/Navbar.component";
import Home from "./components/Home/Home.component";
import Register from "./components/Register/Register.component";
import Login from "./components/login/Login.compnent";
import { UserProvider } from "./Contexts/UserContext";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword.component";
import AddressesComp from "./components/AddressCollection/AddressesComp.component";
import Inventory from "./components/Inventory/Inventory.component";
import ManageStocks from "./components/StockManagement/Manage_stocks.component";
import ManagePizza from "./components/PizzaManagement/ManagePizza.component";
const App = () => {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <NavbarComp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/users/register" element={<Register />} />
            <Route path="/users/reset-password" element={<ForgetPassword/>}/>
            <Route path="/users/profile/myaddresses" element={<AddressesComp/>}/>
            <Route path="/users/inventory"  element={<Inventory/>}/>
            <Route path="/users/inventory/manage-stocks"  element={<ManageStocks/>}/>
            <Route path="/users/inventory/manage-pizza"  element={<ManagePizza/>}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
};

export default App;
