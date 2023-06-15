import React from "react";
import "./Order.styles.css";
import { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext";
import { OrderContext } from "../../Contexts/OrderContext";



const OrderComp = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { orderItems } = useContext(OrderContext);

  

  console.log(orderItems);

  useEffect(() => {
    if (!localStorage.getItem("pizzza")) {
      navigate("/users/login");
    }
    //eslint-disable-next-line
  }, [currentUser]);

  return (
    <div className="container-fluid text-center">
      <h1 style={{ color: "whitesmoke" }}>My Orders</h1>
      {orderItems.map((order, index) => {
        return (
          <div className="accordion" id="accordionExample" key={order._id}>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="true"
                  aria-controls={`collapse${index}`}
                >
                  Order #{index + 1}, OrderId: {order._id}, Total Amount: ₹
                  {order.totalPrice}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse "
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>Date of Order: {order.dateOfOrder}</p>
                  <p>Time of Order: {order.timeOfOrder}</p>
                  <Link
                    className="btn btn-primary"
                    to={`/users/profile/myorders/${order._id}`}
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderComp;
