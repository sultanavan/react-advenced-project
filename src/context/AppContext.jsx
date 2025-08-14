import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users and categories only once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("http://localhost:3000/users");
        const usersData = await usersRes.json();

        const categoriesRes = await fetch("http://localhost:3000/categories");
        const categoriesData = await categoriesRes.json();

        setUsers(usersData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users or categories", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ users, categories, loading }}>
      {children}
    </AppContext.Provider>
  );
};
