import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { OrderContext } from "../../Contexts/OrderContext";
import Alert from "react-bootstrap/Alert";
import "./Order.styles.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000/");

const FullOrderComp = () => {
  const { getParticularOrder } = useContext(OrderContext);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (orderId) {
      socket.emit("join", `order_${orderId}`);
    }
  }, []);

  useEffect(() => {
    socket.on("orderUpdated", (data) => {
      setOrderStatus(data.status);
      setShowAlert(true); // Show the alert
    });
  }, [socket]);

  useEffect(() => {
    getParticularOrder(orderId).then((res) => {
      setOrderDetails(res);
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (orderDetails) {
      setOrderStatus(orderDetails.orderStatus);
    }
  }, [orderDetails]);


  return (
    <div className="order-container">
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          <Alert.Heading>Order Status Updated:</Alert.Heading>
          <h3>
            {orderStatus}
          </h3>
        </Alert>
      )}
      <h2>Order ID: {orderId}</h2>
      {orderDetails && (
        <div>
          <h3>Pizza Details:</h3>
          <ul>
            {orderDetails.item.map((pizza, index) => (
              <li key={index}>
                <strong>Pizza Name:</strong> {pizza.pizzaName},{" "}
                <strong>Quantity:</strong> {pizza.quantity},{" "}
                <strong>Size:</strong> {pizza.size}
              </li>
            ))}
          </ul>
          <p>Total Amount: {orderDetails.totalPrice}</p>
          <p>
            Razorpay Payment ID:{" "}
            {orderDetails.razorpayDetails.razorpay_payment_id}
          </p>
          <h3>Order Status: {orderStatus}</h3>
          <p>Date of Order: {orderDetails.dateOfOrder}</p>
          <p>Time of Order: {orderDetails.timeOfOrder}</p>
          <h3>Delivery Location:</h3>
          <p>House Number: {orderDetails.address.houseNumber}</p>
          <p>Road: {orderDetails.address.road}</p>
          <p>City: {orderDetails.address.city}</p>
          <p>Landmark: {orderDetails.address.landmark}</p>
          <p>Pincode: {orderDetails.address.pincode}</p>
          <h3>Contact Details:</h3>
          <p>Phone: {orderDetails.contact}</p>
        </div>
      )}
    </div>
  );
};

export default FullOrderComp;
