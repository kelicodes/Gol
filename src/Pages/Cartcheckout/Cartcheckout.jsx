import React, { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./CartCheckout.css";

const CartCheckout = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    setCartItemQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useContext(ShopContext);

  return (
    <section className="cart-checkout">
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.images[0]} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: KES {item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        setCartItemQuantity(item.id, Number(e.target.value))
                      }
                    />
                    <button onClick={() => addToCart(item)}>+</button>
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
              <button className="btn-clear" onClick={clearCart}>
                Clear Cart
              </button>
              <button className="btn-checkout">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CartCheckout;
