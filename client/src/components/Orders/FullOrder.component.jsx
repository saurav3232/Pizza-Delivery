import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { OrderContext } from '../../Contexts/OrderContext';
import "./Order.styles.css";

const FullOrderComp = () => {
  const { getParticularOrder } = useContext(OrderContext);
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    getParticularOrder(orderId).then((res) => {
      setOrderDetails(res);
    });
    //eslint-disable-next-line
  }, []);

  return (
    <div className="order-container">
      <h2>Order ID: {orderId}</h2>
      {orderDetails && (
        <div>
          <h3>Pizza Details:</h3>
          <ul>
            {orderDetails.item.map((pizza, index) => (
              <li key={index}>
                <strong>Pizza Name:</strong> {pizza.pizzaName}, <strong>Quantity:</strong>{' '}
                {pizza.quantity}, <strong>Size:</strong> {pizza.size}
              </li>
            ))}
          </ul>
          <p>Total Amount: {orderDetails.totalPrice}</p>
          <p>Razorpay Payment ID: {orderDetails.razorpayDetails.razorpay_payment_id}</p>
          <h3>Order Status: {orderDetails.orderStatus}</h3>
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
