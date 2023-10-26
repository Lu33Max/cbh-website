import React, {
    createContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
  } from "react";
  import { type IOptionalTableSample } from "~/common/types";
  
  type Settings = {
    formatting: boolean, 
    activeColumns: string[]
  }  

  type SettingsContextType = [
    Settings, 
    Dispatch<SetStateAction<Settings>>
  ];
  
  const SettingsContext = createContext<SettingsContextType>([{
    formatting: false, 
    activeColumns: []}, () => ({})]);
  
  interface SettingsProviderProps {
    children: ReactNode;
  }
  
  export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({formatting: false, activeColumns: ["CBH_Donor_ID",
    "CBH_Sample_ID",
    "Matrix",
    "Quantity",
    "Unit",
    "Age",
    "Gender",
    "Price"],});

  
    return (
      <SettingsContext.Provider value={[settings, setSettings]}>
        {children}
      </SettingsContext.Provider>
    );
  };
  
  export default SettingsContext;
  