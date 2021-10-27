import React, { createContext, useState, useContext } from "react";

const ModalRegisterContext = createContext();

export default function ModalRegisterProvider({ children }) {
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <ModalRegisterContext.Provider value={{ openRegister, setOpenRegister }}>
      {children}
    </ModalRegisterContext.Provider>
  );
}

export function useRegisterModal() {
  const context = useContext(ModalRegisterContext);
  const { openRegister, setOpenRegister } = context;
  return { openRegister, setOpenRegister };
}
