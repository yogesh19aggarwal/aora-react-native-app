import { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";

import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = () => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        Alert("Error", error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, fetchUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
