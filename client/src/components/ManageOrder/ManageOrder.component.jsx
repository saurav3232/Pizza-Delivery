import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageOrderComp = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("pizzza")) {
      navigate("/users/login");
    }
  });
  const [orderArr, setOrderArr] = useState([]);
  const getAllOrders = async () => {
    try {
      const { status, data } = await axios.get(
        "http://localhost:5000/api/admin/manage-orders/getallorders",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
          },
        }
      );
      if (status === 200) {
        return data.orders;
      } else {
        Swal.fire("Oops, cannot get orders", "", "error");
        return [];
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      Swal.fire("Oops, something went wrong", "", "error");
      return [];
    }
  };
  useEffect(() => {
    getAllOrders().then((res) => {
      setOrderArr(res);
    });
  }, []);

  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    console.log(newStatus, orderId);
    const {status} = await axios.post(
      "http://localhost:5000/api/admin/manage-orders/update-status",
      {status:newStatus,orderId:orderId},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
      if(status!==200){
        Swal.fire("Could not update status","","error");
        return;
      }
    const updatedOrderArr =await  getAllOrders();
    setOrderArr(updatedOrderArr);
  };

  return (
    <div>
      {orderArr.map((order, index) => (
        <div key={order._id} className="accordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id={`heading-${order._id}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${order._id}`}
                aria-expanded="true"
                aria-controls={`collapse-${order._id}`}
              >
                Order: #{index} , Id: {order._id}, Name: {order.name}, Total
                Amount: {order.totalPrice}
              </button>
            </h2>
            <div
              id={`collapse-${order._id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading-${order._id}`}
            >
              <div className="accordion-body">
                <div>
                  <h3>Pizza Details:</h3>
                  <ul>
                    {order.item.map((pizza, index) => (
                      <li key={index}>
                        <strong>Pizza Name:</strong> {pizza.pizzaName},{" "}
                        <strong>Quantity:</strong> {pizza.quantity},{" "}
                        <strong>Size:</strong> {pizza.size}
                      </li>
                    ))}
                  </ul>
                  <p>Total Amount: {order.totalPrice}</p>
                  <p>
                    Razorpay Payment ID:{" "}
                    {order.razorpayDetails.razorpay_payment_id}
                  </p>
                  <h5>
                    {/* {console.log("Order Status:", order.orderStatus)} */}
                    Set Order Status:
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`status-${order._id}`}
                          value="Payment Done"
                          checked={order.orderStatus === "Payment Done"}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        />
                        Payment Done
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`status-${order._id}`}
                          value="Order Confirmed"
                          checked={order.orderStatus === "Order Confirmed"}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        />
                        Order Confirmed
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`status-${order._id}`}
                          value="Out For Delivery"
                          checked={order.orderStatus === "Out For Delivery"}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        />
                        Out For Delivery
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name={`status-${order._id}`}
                          value="Order Delivered"
                          checked={order.orderStatus === "Order Delivered"}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        />
                        Order Delivered
                      </label>
                    </div>
                  </h5>
                  <p>Date of Order: {order.dateOfOrder}</p>
                  <p>Time of Order: {order.timeOfOrder}</p>
                  <h3>Delivery Location:</h3>
                  <p>House Number: {order.address.houseNumber}</p>
                  <p>Road: {order.address.road}</p>
                  <p>City: {order.address.city}</p>
                  <p>Landmark: {order.address.landmark}</p>
                  <p>Pincode: {order.address.pincode}</p>
                  <h3>Contact Details:</h3>
                  <p>Phone: {order.contact}</p>
                </div>
                {/* Render other order details */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageOrderComp;
