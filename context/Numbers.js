import React, { createContext, useState, useContext, useEffect } from "react";

const NumbersContext = createContext();

export default function ClientProvider({ children }) {
  const [numbers, setNumbers] = useState([]);

  return (
    <NumbersContext.Provider value={{ numbers, setNumbers }}>
      {children}
    </NumbersContext.Provider>
  );
}

export function useNumbers() {
  const context = useContext(NumbersContext);
  const { numbers, setNumbers } = context;
  return { numbers, setNumbers };
}
