import axios from "axios";
export const getPizzaBase = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzabase";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaBases;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getPizzaSauce = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzasauce";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaSauce;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getPizzaVeggies = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzaveggies";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaVeggies;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getPizzaMeat = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzameat";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaMeat;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getPizzaCheese = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzacheese";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaCheese;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getVegPizza = async () => {
    let url = "http://localhost:5000/api/admin/manage-pizza/getpizza/veg";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaData;
    } else {
      console.log(data.error);
      return;
    }
  };
  export const getNonVegPizza = async () => {
    let url = "http://localhost:5000/api/admin/manage-pizza/getpizza/nonVeg";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaData;
    } else {
      console.log(data.error);
      return;
    }
  };
  