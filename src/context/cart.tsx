import React, {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { type IOptionalTableSample } from "~/common/types";

// Define the type for the context value
type CartContextType = [
  IOptionalTableSample[],
  Dispatch<SetStateAction<IOptionalTableSample[]>>
];

// Create a context with the defined type
const CartContext = createContext<CartContextType>([[], () => ({})]);

// Define the props for the CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

// Create the CartProvider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [tableSamples, setTableSamples] = useState<IOptionalTableSample[]>([]);

  return (
    // Provide the context value to its children
    <CartContext.Provider value={[tableSamples, setTableSamples]}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
