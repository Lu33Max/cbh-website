import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { TableSamples } from '~/components/search/table';

type ClickContextType = [TableSamples[], Dispatch<SetStateAction<TableSamples[]>>];

const ClickContext = createContext<ClickContextType>([[], () => {}]);

interface ClickProviderProps {
  children: ReactNode;
}

export const ClickProvider: React.FC<ClickProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<TableSamples[]>([]);
  const addTableSample = (newSample: TableSamples[]) => {
    
    setTableSamples((samples) => [...samples, ...newSample]);
  };

  return (
    <ClickContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </ClickContext.Provider>
  );
};

export default ClickContext;
