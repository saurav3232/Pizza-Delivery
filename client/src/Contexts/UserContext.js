import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      if (localStorage.getItem("pizzza")) {
        const { data } = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
          },
        });
        setCurrentUser(data.user);
      }
    };
    getUser();
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        {children}
    </UserContext.Provider>
  );
};

