import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const BASE_URL = "https://goldback2.onrender.com";

export const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const getToken = () => localStorage.getItem("token");
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  // ======== FETCH PRODUCTS ========
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/fetch`);
      if (res.data.products) setProducts(res.data.products);
    } catch (e) {
      console.log("Fetch products error:", e);
    }
  };

  // ======== HELPER: FETCH FULL PRODUCT DETAILS ========
  const fetchProductDetails = async (productId) => {
    try {
      const res = await axios.get(`${BASE_URL}products/${productId}`);
      return res.data.product;
    } catch (e) {
      console.log("Fetch product details error:", e.response?.data || e.message);
      return null;
    }
  };

  // ======== FETCH CART ========
  const myCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/getcart`, getAuthHeader());
      if (res.data.cart?.items) {
        const items = await Promise.all(
          res.data.cart.items.map(async (i) => {
            const product = await fetchProductDetails(i.productId);
            return {
              productId: i.productId,
              name: product?.name || "N/A",
              price: product?.price || 0,
              category: product?.category || "N/A",
              image: product?.images?.[0] || "",
              quantity: i.quantity,
            };
          })
        );
        setCart(items);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCart([]);
    }
  };


  // ======== FETCH USER ORDERS ========
const fetchUserOrders = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/orders`, getAuthHeader()); // backend route
    if (res.data.success) {
      setOrders(res.data.orders); // store in context state
      return res.data.orders;     // also return for immediate use
    } else {
      console.error("Failed to fetch orders:", res.data.message);
      return [];
    }
  } catch (err) {
    console.error("Fetch user orders error:", err.response?.data || err.message);
    return [];
  }
};

  // ======== ADD TO CART ========
  const addToCart = async (productId, quantity = 1) => {
    const token = getToken();
    if (!token) {
      alert("You must login first!");
      return false;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/cart/add`,
        { productId, quantity },
        getAuthHeader()
      );

      console.log(res.data.items)

      if (res.data.items) {
        const items = await Promise.all(
          res.data.items.map(async (i) => {
            const product = await fetchProductDetails(i.productId);
            return {
              productId: i.productId,
              name: product?.name || "N/A",
              price: product?.price || 0,
              category: product?.category || "N/A",
              image: product?.images?.[0] || "",
              quantity: i.quantity,
            };
          })
        );
        setCart(items);
        return true;
      } else {
        alert("Add to cart failed");
        return false;
      }
    } catch (e) {
      console.log("Add to cart error:", e.response?.data || e.message);
      alert(e.response?.data?.message || "Add to cart failed");
      return false;
    }
  };

  // ======== REMOVE FROM CART ========
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/remove`,
        { productId },
        getAuthHeader()
      );

      if (res.data.cart?.items) {
        const items = await Promise.all(
          res.data.cart.items.map(async (i) => {
            const product = await fetchProductDetails(i.productId);
            return {
              productId: i.productId,
              name: product?.name || "N/A",
              price: product?.price || 0,
              category: product?.category || "N/A",
              image: product?.images?.[0] || "",
              quantity: i.quantity,
            };
          })
        );
        setCart(items);
      }
    } catch (e) {
      console.log("Remove from cart error:", e.response?.data || e.message);
    }
  };

  // ======== UPDATE CART ITEM QUANTITY ========
  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);

    try {
      const res = await axios.post(
        `${BASE_URL}/cart/update`,
        { productId, quantity },
        getAuthHeader()
      );

      if (res.data.cart?.items) {
        const items = await Promise.all(
          res.data.cart.items.map(async (i) => {
            const product = await fetchProductDetails(i.productId);
            return {
              productId: i.productId,
              name: product?.name || "N/A",
              price: product?.price || 0,
              category: product?.category || "N/A",
              image: product?.images?.[0] || "",
              quantity: i.quantity,
            };
          })
        );
        setCart(items);
      }
    } catch (e) {
      console.log("Update cart quantity error:", e.response?.data || e.message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/clear`, {}, getAuthHeader());
      setCart([]);
    } catch (e) {
      console.log("Clear cart error:", e.response?.data || e.message);
    }
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ======== ORDERS ========
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/user`, getAuthHeader());
      if (res.data) setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err.response?.data || err.message);
    }
  };

  const createOrder = async (paymentMethod, shippingAddress) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/orders/create`,
        { paymentMethod, shippingAddress },
        getAuthHeader()
      );
      if (res.data.order) {
        setOrders((prev) => [res.data.order, ...prev]);
        setCart([]);
      }
      return res.data;
    } catch (e) {
      console.log("Create order error:", e.response?.data || e.message);
      return { success: false };
    }
  };

  // ShopContext.jsx
const fetchProductById = async (productId) => {
  try {
    const res = await fetch(`https://goldback2.onrender.com/product/${productId}`);
    const data = await res.json();
    if (data.success) {
      return data.theproduct; // returns the actual product object
    } else {
      console.error("Failed to fetch product:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Fetch product error:", err);
    return null;
  }
};


  const payWithMpesa = async (orderId, phone) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/pesa/callback`,
        { orderId, phone },
        getAuthHeader()
      );
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
        fetchProductById,
        fetchUserOrders
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
