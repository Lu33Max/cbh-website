import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
  
  // Define the type for settings
  type Settings = {
    formatting: boolean, 
    activeColumns: string[]
  }  

  // Define the type for the context value
  type SettingsContextType = [
    Settings, 
    Dispatch<SetStateAction<Settings>>
  ];
  
  // Create a context with the defined type
  const SettingsContext = createContext<SettingsContextType>([{
    formatting: false, 
    activeColumns: []}, () => ({})]);
  
  // Define the props for the SettingsProvider component
  interface SettingsProviderProps {
    children: ReactNode;
  }
  
  // Create the SettingsProvider component
  export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {

    // Initialize state for settings
    const [settings, setSettings] = useState<Settings>({formatting: false, activeColumns: ["CBH_Donor_ID",
    "CBH_Sample_ID",
    "Matrix",
    "Quantity",
    "Unit",
    "Age",
    "Gender",
    "Price"],});

  
    return (
      // Provide the context value to its children
      <SettingsContext.Provider value={[settings, setSettings]}>
        {children}
      </SettingsContext.Provider>
    );
  };
  
  export default SettingsContext;
  