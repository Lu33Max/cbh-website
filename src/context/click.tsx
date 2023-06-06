/*import React, { createContext, useState, ReactNode } from 'react';

type TableSample = {
  id: number;
  name: string;
};

type ClickContextType = [TableSample[], () => void];

const ClickContext = createContext<ClickContextType>([[], () => {}]);

interface ClickProviderProps {
  children: ReactNode;
}

export const ClickProvider: React.FC<ClickProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<TableSample[]>([]);
  const addTableSample = () => {
    const newSample: TableSample = {
      id: tableSamples.length + 1,
      name: `Sample ${tableSamples.length + 1}`,
    };
    setTableSamples((samples) => [...samples, newSample]);
  };

  return (
    <ClickContext.Provider value={[tableSamples, addTableSample]}>
      {children}
    </ClickContext.Provider>
  );
};

export default ClickContext;*/
