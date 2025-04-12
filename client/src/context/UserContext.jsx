import React, { createContext, useEffect, useState } from "react";
import { isTokenExpired } from "../lib/utils";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("token", JSON.stringify(userData.token));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
  };

  const updateUserData = (userData) => {
    const updatedData = { ...userData, token: user.token };
    setUser(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
    localStorage.setItem("token", JSON.stringify(updatedData.token));
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedData = JSON.parse(userData);

      if (parsedData.token && !isTokenExpired(parsedData.token)) {
        setUser(parsedData);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userData' && !e.newValue) {
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      updateUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
