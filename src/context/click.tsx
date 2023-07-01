import React, { createContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import { type IOptionalTableSample } from '~/common/types';

type CartContextType = [IOptionalTableSample[], Dispatch<SetStateAction<IOptionalTableSample[]>>];

const CartContext = createContext<CartContextType>([[], () => ({})]);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<IOptionalTableSample[]>([]);

  return (
    <CartContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
