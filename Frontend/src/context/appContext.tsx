// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  contextApplicationId: string | undefined;
  contextEventId: string | undefined;
  eventPageNumber: number;
  appPageNumber: number;
  setContextApplicationId: (id: string | undefined) => void;
  setContextEventId: (id: string | undefined) => void;
  setEventPageNumber: (pageNumber: number) => void;
  setAppPageNumber: (pageNumber: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contextApplicationId, setContextApplicationId] = useState<
    string | undefined
  >("");
  const [contextEventId, setContextEventId] = useState<string | undefined>("");
  const [eventPageNumber, setEventPageNumber] = useState<number>(1);
  const [appPageNumber, setAppPageNumber] = useState<number>(1);

  const contextValue: AppContextType = {
    contextApplicationId,
    contextEventId,
    eventPageNumber,
    appPageNumber,
    setContextApplicationId,
    setContextEventId,
    setEventPageNumber,
    setAppPageNumber,
  };

  return (
    <AppContext.Provider value={contextValue as AppContextType}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
