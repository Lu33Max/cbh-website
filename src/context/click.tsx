import React, { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { type IOptionalTableSample } from '~/common/types';

type ClickContextType = [IOptionalTableSample[], Dispatch<SetStateAction<IOptionalTableSample[]>>];

const ClickContext = createContext<ClickContextType>([[], () => ({})]);

interface ClickProviderProps {
  children: ReactNode;
}

export const ClickProvider: React.FC<ClickProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<IOptionalTableSample[]>([]);

  return (
    <ClickContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </ClickContext.Provider>
  );
};

export default ClickContext;
