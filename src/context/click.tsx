import React, { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { type TableSamples } from '~/components/search/table';

type ClickContextType = [TableSamples[], Dispatch<SetStateAction<TableSamples[]>>];

const ClickContext = createContext<ClickContextType>([[], () => ({})]);

interface ClickProviderProps {
  children: ReactNode;
}

export const ClickProvider: React.FC<ClickProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<TableSamples[]>([]);

  return (
    <ClickContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </ClickContext.Provider>
  );
};

export default ClickContext;
