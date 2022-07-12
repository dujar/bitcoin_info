import React, { createContext, useContext } from "react";
import { useBitcoin } from "./bitcoin";

interface ServiceContextProps {
  bitcoin: ReturnType<typeof useBitcoin>;
}

export const ServiceContext = createContext(
  null as unknown as ServiceContextProps
);

export const ServiceContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <ServiceContext.Provider value={{ bitcoin: useBitcoin() }}>
      {children}
    </ServiceContext.Provider>
  );
};
export const useService = () => useContext(ServiceContext);
