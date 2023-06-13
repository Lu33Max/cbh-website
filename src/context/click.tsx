import React, { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { type TableSamples, OptionalSamples } from '~/components/search/table';
import { type OptionalTableSamples } from '~/components/search/table';

type ClickContextType = [OptionalTableSamples[], Dispatch<SetStateAction<OptionalTableSamples[]>>];

const ClickContext = createContext<ClickContextType>([[], () => ({})]);

interface ClickProviderProps {
  children: ReactNode;
}

export const ClickProvider: React.FC<ClickProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<OptionalTableSamples[]>([]);

  return (
    <ClickContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </ClickContext.Provider>
  );
};

export default ClickContext;
