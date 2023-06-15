import { createContext, useState,useEffect } from "react";
import Swal from "sweetalert2";
import { UserContext } from "./UserContext";
import { useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const {currentUser}=useContext(UserContext);


  useEffect(() => {
    const storedCartItems = localStorage.getItem("pizzaCartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);


  const updateItemCount = (pizzaData) => {
    const storedCartItems = localStorage.getItem("pizzaCartItems");
    if (storedCartItems) {
      const parsedCartItems = JSON.parse(storedCartItems);
      const pizzaItem = parsedCartItems.find(
        (item) => item._id === pizzaData._id
      );
      if(pizzaItem!==undefined && pizzaItem.userId!==currentUser.user){
        return 0;
      }
      if (pizzaItem) {
        const totalItemsCount = pizzaItem.sizes.reduce((count, sizeItem) => {
          return count + sizeItem.count;
        }, 0);
        return totalItemsCount;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const handleAddToCart = (pizzaData, selectedSize) => {
    if (selectedSize === "DEFAULT") {
      Swal.fire("Select a Valid Size", "", "warning");
      return;
    }
    let size="";
    if(selectedSize!=="1" && selectedSize!=="2" && selectedSize!=="3")
    {
        size=selectedSize
    }    
    else{
        size =
      selectedSize === "1"
        ? "small"
        : selectedSize === "2"
        ? "medium"
        : "large";
    }
    
    const pizzaItem = {
      _id: pizzaData._id,
      pizzaData: pizzaData,
      sizes: [{ size: size, count: 1 }],
      userId: currentUser.user,
    };

    let storedCartItems = localStorage.getItem("pizzaCartItems");
    if (storedCartItems) {
      storedCartItems = JSON.parse(storedCartItems);
      const existingPizzaIndex = storedCartItems.findIndex(
        (item) => item._id === pizzaData._id
      );
      if (existingPizzaIndex !== -1) {
        const existingItem = storedCartItems[existingPizzaIndex];
        const existingSizeIndex = existingItem.sizes.findIndex(
          (sizeItem) => sizeItem.size === size
        );
        if (existingSizeIndex !== -1) {
          existingItem.sizes[existingSizeIndex].count += 1;
        } else {
          existingItem.sizes.push({ size: size, count: 1 });
        }
      } else {
        storedCartItems.push(pizzaItem);
      }
    } else {
      storedCartItems = [pizzaItem];
    }

    localStorage.setItem("pizzaCartItems", JSON.stringify(storedCartItems));
    setCartItems(storedCartItems);
  };

  const handleRemoveFromCart = (pizzaData, size) => {
    const storedCartItems = localStorage.getItem("pizzaCartItems");
    const parsedCartItems = JSON.parse(storedCartItems);
    const existingPizzaIndex = parsedCartItems.findIndex(
      (item) => item._id === pizzaData._id
    );
    let modSize = "";
    if (size !== undefined) {
      modSize = size;
      console.log(size, modSize);
    }
    if (storedCartItems) {
      if (existingPizzaIndex !== -1) {
        const existingItem = parsedCartItems[existingPizzaIndex];
        if (existingItem.sizes.length > 1 && size===undefined) {
          Swal.fire(
            "Multiple Customizations, Remove item from cart",
            "",
            "warning"
          );
          return;
        } else {
          const sizeIndex = modSize
            ? existingItem.sizes.findIndex(
                (sizeItem) => sizeItem.size === modSize
              )
            : 0;
          if (sizeIndex !== -1) {
            existingItem.sizes[sizeIndex].count -= 1;
            if (existingItem.sizes[sizeIndex].count === 0) {
              existingItem.sizes.splice(sizeIndex, 1);
            }
            if (existingItem.sizes.length === 0) {
              parsedCartItems.splice(existingPizzaIndex, 1);
            }
            localStorage.setItem(
              "pizzaCartItems",
              JSON.stringify(parsedCartItems)
            );
            setCartItems(parsedCartItems);
          }
        }
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateItemCount,
        handleAddToCart,
        handleRemoveFromCart,
        setCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
