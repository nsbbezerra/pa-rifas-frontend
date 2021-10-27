import React, { createContext, useState, useContext } from "react";

const ModalLoginContext = createContext();

export default function ModalLoginProvider({ children }) {
  const [openLogin, setOpenLogin] = useState(false);

  return (
    <ModalLoginContext.Provider value={{ openLogin, setOpenLogin }}>
      {children}
    </ModalLoginContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(ModalLoginContext);
  const { openLogin, setOpenLogin } = context;
  return { openLogin, setOpenLogin };
}
