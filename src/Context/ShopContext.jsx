import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const BASE_URL = "https://goldback2.onrender.com";

export const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Helper to get token
  const getToken = () => localStorage.getItem("token");

  // ======== FETCH PRODUCTS ========
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      if (res.data.products) setProducts(res.data.products);
    } catch (e) {
      console.log("Fetch products error:", e);
    }
  };

  // ======== FETCH CART ========
  const myCart = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/getcart`, { token: getToken() });
      if (res.data.success && res.data.items) {
        const items = res.data.items.map(i => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity,
        }));
        setCart(items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCart([]);
    }
  };

  // ======== FETCH ORDERS ========
  const fetchOrders = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/orders/user`, { token: getToken() });
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    }
  };

  // ======== ADD TO CART ========
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/add`, { productId, quantity, token: getToken() });

      if (res.data.success && res.data.items) {
        const items = res.data.items.map(i => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity,
        }));
        setCart(items);
        alert("add to cart successfull")
        return true;
      }else{
        alert("add to cart failed")
      return false;}
    } catch (e) {
      console.log("Add to cart error:", e.response?.data || e.message);
      return false;
    }
  };

  // ======== OTHER CART FUNCTIONS ========
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/remove`, { productId, token: getToken() });

      if (res.data.success && res.data.items) {
        const items = res.data.items.map(i => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity,
        }));
        setCart(items);
      }
    } catch (e) {
      console.log("Remove from cart error:", e.response?.data || e.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/clear`, { token: getToken() });
      setCart([]);
    } catch (e) {
      console.log("Clear cart error:", e.response?.data || e.message);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    try {
      const res = await axios.post(`${BASE_URL}/cart/update`, { productId, quantity, token: getToken() });

      if (res.data.success && res.data.items) {
        const items = res.data.items.map(i => ({
          productId: i.productId._id,
          name: i.productId.name,
          price: i.productId.price,
          quantity: i.quantity,
        }));
        setCart(items);
      }
    } catch (e) {
      console.log("Update cart quantity error:", e.response?.data || e.message);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ======== ORDERS ========
  const createOrder = async (paymentMethod, shippingAddress) => {
    try {
      const res = await axios.post(`${BASE_URL}/orders/create`, { paymentMethod, shippingAddress, token: getToken() });

      if (res.data.order) {
        setOrders(prev => [res.data.order, ...prev]);
        setCart([]);
      }
      return res.data;
    } catch (e) {
      console.log("Create order error:", e.response?.data || e.message);
      return { success: false };
    }
  };

  const payWithMpesa = async (orderId, phone) => {
    try {
      const res = await axios.post(`${BASE_URL}/mpesa/stk`, { orderId, phone, token: getToken() });
      return res.data;
    } catch (e) {
      console.log("STK push error:", e.response?.data || e.message);
      return { success: false };
    }
  };

  // ======== INITIAL LOAD ========
  useEffect(() => {
    const init = async () => {
      try {
        await fetchProducts();
        await myCart();
        await fetchOrders();
      } catch (err) {
        console.log("Initialization error:", err);
      }
    };
    init();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        myCart,
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
        fetchOrders,
        createOrder,
        payWithMpesa,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
