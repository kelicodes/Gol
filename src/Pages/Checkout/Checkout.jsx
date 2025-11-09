import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Checkout.css";

const CheckoutPage = () => {
  const { cart, getTotalPrice, getTotalItems, createOrder, clearCart, payWithMpesa } = useContext(ShopContext);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    apartment: "Apartment A",
    doorNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Create order on backend
      const orderData = await createOrder("Mpesa", shippingInfo);
      if (!orderData.success) {
        setMessage("Failed to create order. Try again.");
        setLoading(false);
        return;
      }

      // 2️⃣ Trigger STK Push for payment
      const paymentResponse = await payWithMpesa(orderData.order._id, shippingInfo.phone);

      if (paymentResponse.success) {
        setMessage("Order placed! Please complete payment on your phone.");
        clearCart(); // Clear cart after order
      } else {
        setMessage("Order created but payment failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Shipping Information</h2>
      <div className="checkout-container">

        {/* Cart Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.productId}>
                  {item.name} x {item.quantity} - KES {item.price * item.quantity}
                </li>
              ))}
            </ul>
          )}
          <p>Total Items: {getTotalItems()}</p>
          <p>Total Price: KES {getTotalPrice()}</p>
        </div>

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

          <button type="submit" className="btn-place-order" disabled={loading}>
            {loading ? "Processing..." : "Place Order & Pay"}
          </button>

          {message && <p className="checkout-message">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
