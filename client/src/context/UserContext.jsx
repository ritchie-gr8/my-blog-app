import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
  };

  const updateUserData = (userData) => {
    const updatedData = { ...userData, token: user.token };
    setUser(updatedData);
    localStorage.setItem("userData", JSON.stringify(updatedData));
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (userData) {
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
    }
    setLoading(false);
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
