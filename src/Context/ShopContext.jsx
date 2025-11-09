import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const BASE_URL = "https://goldback2.onrender.com"; // your backend

export const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // ======== FETCH PRODUCTS ========
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/fetch`);
      if (response.data.products) setProducts(response.data.products);
    } catch (e) {
      console.log("Fetch products error:", e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart(); // fetch cart on mount if user logged in
    fetchOrders(); // fetch orders for logged-in user
  }, []);

  // ======== CART ENDPOINTS ========
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/get`, {
        withCredentials: true, // send cookies with JWT
      });
      if (res.data.cart) setCart(res.data.cart.items);
    } catch (e) {
      console.log("Fetch cart error:", e);
    }
  };

 const addToCart = async (productId) => {
  try {
    const token = localStorage.getItem("token"); // get token from localStorage

    if (!token) return alert("Please log in to add items to cart");

    // Set token as a cookie manually before the request
    document.cookie = `token=${token}; path=/;`;

    const res = await axios.post(
      `${BASE_URL}/cart/add`,
      { productId, quantity: 1 },
      { withCredentials: true } // send cookies with request
    );

    setCart(res.data.items);
  } catch (e) {
    console.log("Add to cart error:", e);
  }
};


  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/remove`,
        { productId },
        { withCredentials: true }
      );
      setCart(res.data.items);
    } catch (e) {
      console.log("Remove from cart error:", e);
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/clear`,
        {},
        { withCredentials: true }
      );
      setCart(res.data.cart.items);
    } catch (e) {
      console.log("Clear cart error:", e);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    try {
      const res = await axios.post(
        `${BASE_URL}/cart/update`,
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(res.data.items);
    } catch (e) {
      console.log("Update cart quantity error:", e);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ======== ORDERS ========
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/user`, { withCredentials: true });
      if (res.data) setOrders(res.data);
    } catch (e) {
      console.log("Fetch orders error:", e);
    }
  };

  const createOrder = async (paymentMethod, shippingAddress) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/orders/create`,
        { paymentMethod, shippingAddress },
        { withCredentials: true }
      );
      if (res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        setCart([]); // cart cleared after order
      }
      return res.data;
    } catch (e) {
      console.log("Create order error:", e);
      return { success: false };
    }
  };

  const payWithMpesa = async (orderId, phone) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/mpesa/stk`,
        { orderId, phone },
        { withCredentials: true }
      );
      return res.data;
    } catch (e) {
      console.log("STK push error:", e);
      return { success: false };
    }
  };

  // ======== SHOP CONTEXT VALUE ========
  const contextValue = {
    products,
    cart,
    orders,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
    getTotalItems,
    getTotalPrice,
    fetchProducts,
    fetchCart,
    fetchOrders,
    createOrder,
    payWithMpesa,
  };

  return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};
