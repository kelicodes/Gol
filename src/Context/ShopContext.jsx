import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const Fetchproducts = async () => {
    try {
      const response = await axios.get("https://goldback2.onrender.com/products/fetch");
      if (response) setProducts(response.data.products);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    Fetchproducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItem = (productId) => cart.find((item) => item.id === productId);

  const setCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const contextValue = {
    products,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartItem,
    setCartItemQuantity,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
