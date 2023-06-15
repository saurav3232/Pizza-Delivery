import { createContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { useContext } from "react";
import axios from "axios";
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const { currentUser } = useContext(UserContext);

  const getOrderItems = async () => {
    const { status, data } = await axios.get(
      "http://localhost:5000/api/users/myorders/getmyorders/" +
        currentUser.user,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      // console.log(data);
      return data.orderDetails;
    }
  };
  const getParticularOrder = async (orderId) => {
    const { status, data } = await axios.get(
      "http://localhost:5000/api/users/myorders/order/" + orderId,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      // console.log(data);
      return data.orderDetails;
    }
  };
  useEffect(() => {
    if (currentUser) {
      getOrderItems().then((res) => {
        // console.log(res);
        setOrderItems(res);
      });
    }
    //eslint-disable-next-line
  }, [currentUser]);

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        setOrderItems,
        getOrderItems,
        getParticularOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
