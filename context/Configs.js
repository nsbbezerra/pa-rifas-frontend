import React, { createContext, useState, useContext } from "react";

const ConfigContext = createContext();

export default function ClientProvider({ children }) {
  const [configs, setConfigs] = useState({});

  return (
    <ConfigContext.Provider value={{ configs, setConfigs }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigs() {
  const context = useContext(ConfigContext);
  const { configs, setConfigs } = context;
  return { configs, setConfigs };
}
