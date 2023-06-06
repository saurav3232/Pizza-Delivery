// api.js
import axios from "axios";

export const getUser = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    return data.user;
  } catch (error) {
    return null;
  }
};
