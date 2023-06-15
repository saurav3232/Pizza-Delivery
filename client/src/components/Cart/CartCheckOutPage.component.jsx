import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../../Contexts/CartContext";
import { UserContext } from "../../Contexts/UserContext";
import {
  MDBCard,
  MDBCardHeader,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import "./cart.styles.css";
import Swal from "sweetalert2";
import PlaceOrder from "./PlaceOrder.component";
import { OrderContext } from "../../Contexts/OrderContext";

const CartCheckoutPage = () => {
  const { cartItems, updateItemCount, handleAddToCart, handleRemoveFromCart } =
    useContext(CartContext);
  const { getOrderItems, setOrderItems } = useContext(OrderContext);
  const { currentUser } = useContext(UserContext);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [availability, setAvailibility] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [contact, setContact] = useState("");
  const [showDeliveryAddress, setShowDeliveryAddress] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleRemove = (pizzaData, size) => {
    handleRemoveFromCart(pizzaData, size);
    updateItemCount(pizzaData);
  };

  const handleAdd = (pizzaData, size) => {
    handleAddToCart(pizzaData, size);
    updateItemCount(pizzaData);
  };
  const gettotalPayable = () => {
    return cartItems
      .filter((item) => item.userId === currentUser.user)
      .reduce((sum, cartItem) => {
        return (
          sum +
          cartItem.sizes.reduce((total, sizeItem) => {
            const pizzaSize = sizeItem.size.toLowerCase();
            const pizzaPrice = cartItem.pizzaData.price[pizzaSize + "Pizza"];
            return total + sizeItem.count * pizzaPrice;
          }, 0)
        );
      }, 0);
  };
  useEffect(() => {
    if (currentUser) {
      const res = gettotalPayable();
      setTotal(res);
    }
    // console.log(res);
    // eslint-disable-next-line
  }, [currentUser, cartItems]);

  const sendConfirmationOrder = async () => {
    console.log(cartItems);
    const { status, data } = await axios.post(
      "http://localhost:5000/api/users/pizza-menu/cart/confirm-order",
      { cartItems },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      Swal.fire("You can place the order", "", "success");
      setAvailibility(true);
      return;
    } else {
      console.log(data.msg);
      Swal.fire({
        title:
          "<strong><u><h3>Try to reduce the following items</h3></u></strong>",
        icon: "info",
        html: `<ul>
          ${data.msg.map(
            (message) =>
              `<li className="d-flex justify-content-start">${message.pizzaName} by ${message.insufficientAmount} of size: ${message.size}</li>`
          )}
          </ul>`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: "Thumbs up, great!",
        cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: "Thumbs down",
      });
      return;
    }
  };

  const generateOrderData = (
    currentUser,
    cartItems,
    deliveryLocation,
    contact,
    razorpayDetails
  ) => {
    const orderData = {
      name: currentUser.name,
      userId: currentUser.user,
      item: [],
      address: deliveryLocation,
      contact: contact,
      totalPrice: total,
      orderStatus: "Payment Done",
      timeOfOrder: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dateOfOrder: new Date().toISOString().split("T")[0],
      razorpayDetails: razorpayDetails,
    };

    cartItems
      .filter((item) => item.userId === currentUser.user)
      .forEach((cartItem) => {
        cartItem.sizes.forEach((sizeItem) => {
          const orderItem = {
            pizzaName: cartItem.pizzaData.pizzaName,
            quantity: sizeItem.count,
            size: sizeItem.size,
            pizzaId: cartItem.pizzaData._id,
          };
          orderData.item.push(orderItem);
        });
      });

    return orderData;
  };

  const verifyPayment = async (razorpayDetails) => {
    const { status } = await axios.post(
      "http://localhost:5000/api/users/payment/paymentverification",
      { razorpayDetails },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      // Swal.fire("Signature is valid", "", "success");
      const orderData = generateOrderData(
        currentUser,
        cartItems,
        deliveryLocation,
        contact,
        razorpayDetails
      );
      const { status, data } = await axios.post(
        "http://localhost:5000/api/users/myorders/add-order",
        { orderData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
          },
        }
      );
      if (status === 200) {
        const response = await getOrderItems();
        setOrderItems(response);
        Swal.fire(
          `Payment Done , Your order id is ${data.orderId}`,
          "",
          "success"
        );
      } else {
        Swal.fire("Something Went Wrong", "", "error");
      }
    } else {
      Swal.fire("Invalid Signature", "", "error");
    }
    return;
  };

  const handlePayment = async (order) => {
    console.log(order);
    let key = "";
    const { status, data } = await axios.get(
      "http://localhost:5000/api/users/payment/getkey",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );
    if (status === 200) {
      key = data.key;
      console.log(key);
      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "Pizza Delivery",
        description: "Test Transaction",
        image:
          "https://image.lexica.art/full_jpg/7a63a0de-f42b-4afb-9965-939979f7dc3e",
        order_id: order.id,
        handler: function (response) {
          verifyPayment(response);
        },

        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: "9999999999",
        },
        notes: {
          address: deliveryLocation.road,
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      Swal.fire("Cannot get key", "", "error");
      return;
    }
  };

  const checkOutHandler = async () => {
    const { status, data } = await axios.post(
      "http://localhost:5000/api/users/payment/createOrders",
      { amount: total },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
        },
      }
    );

    if (status === 200) {
      // Swal.fire("Payment Done", "", "success");
      handlePayment(data.order);
    }
  };

  return (
    <div className="container text-center">
      {console.log(deliveryLocation, contact)}
      <h1 style={{ color: "white" }}>Checkout</h1>
      {cartItems.length === 0 ? (
        <h3 style={{ color: "white" }}>Your cart is empty.</h3>
      ) : (
        <div className="table-responsive">
          <table className="table cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUser &&
                cartItems
                  .filter((item) => item.userId === currentUser.user) // Filter cartItems based on currentUser.user
                  .map((cartItem) =>
                    cartItem.sizes.map((sizeItem) => (
                      <tr key={`${cartItem._id}-${sizeItem.size}`}>
                        <td>
                          <img
                            src={cartItem.pizzaData.pizzaAvatar}
                            alt={cartItem.pizzaData.pizzaName}
                            style={{ maxHeight: "6rem", maxWidth: "6rem" }}
                          />
                        </td>
                        <td>{cartItem.pizzaData.pizzaName}</td>
                        <td>{sizeItem.size}</td>
                        <td>{sizeItem.count}</td>
                        <td>
                          {sizeItem.count *
                            Number(
                              cartItem.pizzaData.price[sizeItem.size + "Pizza"]
                            )}
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary me-2"
                            style={{ fontSize: "1.5rem" }}
                            onClick={() =>
                              handleRemove(cartItem.pizzaData, sizeItem.size)
                            }
                          >
                            -
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleAdd(cartItem.pizzaData, sizeItem.size)
                            }
                            style={{ fontSize: "1.5rem" }}
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
            </tbody>
          </table>
          <div>
            <h2 style={{ color: "white" }}>
              Total Payable: <span>{total}</span>{" "}
            </h2>
            <div className="d-flex flex-row flex-wrap  align-items-center justify-content-between">
              {showDeliveryAddress && (
                <MDBCard>
                  <MDBCardHeader>Delivery Address </MDBCardHeader>
                  <MDBListGroup>
                    <MDBListGroupItem>
                      <label>
                        House/Flat Number: {deliveryLocation.houseNumber}
                      </label>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <label>Road: {deliveryLocation.road}</label>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <label>City: {deliveryLocation.city}</label>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <label>Landmark: {deliveryLocation.landmark}</label>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <label>Pincode: {deliveryLocation.pincode}</label>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCard>
              )}
              {showContact && (
                <h3
                  style={{
                    color: "white",
                    backgroundColor: "brown",
                    borderRadius: "10px",
                  }}
                >
                  Contact:{contact}
                </h3>
              )}
              {showContact && showDeliveryAddress && (
                <button
                  className="btn btn-success btn-lg"
                  onClick={checkOutHandler}
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center flex-wrap">
            <button className="btn btn-primary" onClick={sendConfirmationOrder}>
              Check availability
            </button>
            {availability && (
              <>
                <button
                  className="btn btn-primary ms-5"
                  onClick={() => {
                    setScrollableModal(!scrollableModal);
                    setShowDeliveryAddress(false);
                    setShowContact(false);
                  }}
                >
                  Add/Modify details
                </button>
                <PlaceOrder
                  scrollableModal={scrollableModal}
                  setScrollableModal={setScrollableModal}
                  deliveryLocation={deliveryLocation}
                  setDeliveryLocation={setDeliveryLocation}
                  contact={contact}
                  setContact={setContact}
                  setShowDeliveryAddress={setShowDeliveryAddress}
                  setShowContact={setShowContact}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckoutPage;
