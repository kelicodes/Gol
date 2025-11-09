import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./CartCheckout.css";

const CartCheckout = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, setCartItemQuantity, clearCart, getTotalItems, getTotalPrice, fetchProductById } = useContext(ShopContext);

  const [loading, setLoading] = useState(false);
  const [cartDetails, setCartDetails] = useState([]);

  // Fetch full product info
  useEffect(() => {
    const loadCartDetails = async () => {
      const details = await Promise.all(
        cart.map(async (item) => {
          // If placeholder, fetch from backend
          if (!item.name || item.name === "N/A") {
            const fullProduct = await fetchProductById(item.productId);
            if (fullProduct) {
              return { ...item, ...fullProduct, quantity: item.quantity };
            }
          }
          return item;
        })
      );
      setCartDetails(details);
    };

    loadCartDetails();
  }, [cart]);

  const handleIncrease = async (item) => {
    setLoading(true);
    try {
      await addToCart(item.productId, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (item) => {
    setLoading(true);
    try {
      await removeFromCart(item.productId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (item, qty) => {
    if (qty <= 0) return;
    setLoading(true);
    try {
      await setCartItemQuantity(item.productId, qty);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = () => navigate("/checkout");

  return (
    <section className="cart-checkout">
      <h2 className="cart-title">Your Cart</h2>

      {cartDetails.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartDetails.map((item, index) => (
              <div className="cart-item" key={`${item.productId}-${index}`}>
                {item.images && item.images[0] && (
                  <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                )}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Category: {item.category || "N/A"}</p>
                  <p>Price: KES {item.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleDecrease(item)} disabled={loading}>-</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                      disabled={loading}
                    />
                    <button onClick={() => handleIncrease(item)} disabled={loading}>+</button>
                  </div>

                  <p>Subtotal: KES {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {getTotalItems()}</p>
            <p>Total Price: KES {getTotalPrice()}</p>

            <div className="cart-actions">
              <button className="btn-clear" onClick={clearCart} disabled={loading}>Clear Cart</button>
              <button className="btn-checkout" onClick={proceedToCheckout} disabled={loading}>Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CartCheckout;
