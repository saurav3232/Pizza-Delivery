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
import Menu from "./components/Menu/Menu.component";
import { CartProvider } from "./Contexts/CartContext";
import CartCheckOutPage from "./components/Cart/CartCheckOutPage.component";
import OrderComp from "./components/Orders/Order.component";
import FullOrderComp from "./components/Orders/FullOrder.component";
import ManageOrderComp from "./components/ManageOrder/ManageOrder.component";
import { OrderProvider } from "./Contexts/OrderContext";
const App = () => {
  return (
    <>
      <UserProvider>
        <OrderProvider>
          <CartProvider>
            <BrowserRouter>
              <NavbarComp />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users/login" element={<Login />} />
                <Route path="/users/register" element={<Register />} />
                <Route
                  path="/users/reset-password"
                  element={<ForgetPassword />}
                />
                <Route
                  path="/users/profile/myaddresses"
                  element={<AddressesComp />}
                />
                <Route path="/users/profile/myorders" element={<OrderComp />} />
                <Route path="/users/profile/myorders/:orderId" element={<FullOrderComp />} />
                <Route path="/users/inventory" element={<Inventory />} />
                <Route
                  path="/users/inventory/manage-stocks"
                  element={<ManageStocks />}
                />
                <Route
                  path="/users/inventory/manage-orders"
                  element={<ManageOrderComp />}
                />
                <Route
                  path="/users/inventory/manage-pizza"
                  element={<ManagePizza />}
                />
                <Route path="/users/menu" element={<Menu />} />
                <Route path="/users/cart" element={<CartCheckOutPage />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </OrderProvider>
      </UserProvider>
    </>
  );
};

export default App;
