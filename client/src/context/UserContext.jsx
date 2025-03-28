import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData")
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const token = userData?.token;

    if (token) {
      axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    if (userData) {
      console.log(userData)
      login(JSON.parse(userData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
