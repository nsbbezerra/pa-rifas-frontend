import React, { createContext, useState, useContext } from "react";

const ClientContext = createContext();

export default function ClientProvider({ children }) {
  const [client, setClient] = useState({});

  return (
    <ClientContext.Provider value={{ client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  const { client, setClient } = context;
  return { client, setClient };
}
