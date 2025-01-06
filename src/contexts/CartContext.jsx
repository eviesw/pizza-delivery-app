import { createContext, useState, useContext, useEffect } from "react";
import { debounce } from "lodash";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartNotes, setCartNotes] = useState("");

  const debouncedSaveCart = debounce((cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, 300);

  useEffect(() => {
    debouncedSaveCart(cart);
    return () => debouncedSaveCart.cancel();
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        clearCart,
        cartNotes,
        setCartNotes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
