import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cart, getTotalPrice, getTotalItems, clearCart } = useContext(ShopContext);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    apartment: "Apartment A",
    doorNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed! \nTotal: KES ${getTotalPrice()} \nShipping to ${shippingInfo.apartment}, Door ${shippingInfo.doorNumber}`);
    clearCart(); // Clear cart after order
  };

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Shipping Information</h2>
      <div className="checkout-container">
        {/* Shipping Form */}
        <form className="shipping-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={shippingInfo.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              required
              placeholder="0712345678"
            />
          </label>

          <label>
            Apartment:
            <select
              name="apartment"
              value={shippingInfo.apartment}
              onChange={handleChange}
            >
              <option value="Apartment A">Apartment A</option>
              <option value="Apartment B">Apartment B</option>
              <option value="Apartment C">Apartment C</option>
              <option value="Apartment D">Apartment D</option>
            </select>
          </label>

          <label>
            Door Number:
            <input
              type="text"
              name="doorNumber"
              value={shippingInfo.doorNumber}
              onChange={handleChange}
              required
              placeholder="101"
            />
          </label>

          <button type="submit" className="btn-place-order">
            Place Order
          </button>
        </form>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} x {item.quantity} - KES {item.price * item.quantity}
                </li>
              ))}
            </ul>
          )}
          <p>Total Items: {getTotalItems()}</p>
          <p>Total Price: KES {getTotalPrice()}</p>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
