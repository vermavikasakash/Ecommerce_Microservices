import { useContext, useEffect, useState, createContext } from "react";
import axios from "axios";

const ContextApi = createContext();

// ?? GLOBALLY SENDING
const ContextProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState([]);

  const addToCart = (product) => {
    setGlobalData([...globalData, { ...product, quantity: 1 }]);
  };

  return (
    <ContextApi.Provider value={[globalData, setGlobalData, addToCart]}>
      {children}
    </ContextApi.Provider>
  );
};

//custom hook
const useGlobalData = () => useContext(ContextApi);
export { ContextProvider, useGlobalData };
