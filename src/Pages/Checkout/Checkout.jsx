import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { useNavigate } from "react-router-dom";   // ✅ Add this
import "./Checkout.css";

const CheckoutPage = () => {
  const { cart, getTotalPrice, getTotalItems, createOrder, clearCart, payWithMpesa } = useContext(ShopContext);
  const navigate = useNavigate(); // ✅ Initialize navigation

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
      const orderData = await createOrder("Mpesa", shippingInfo);

      if (!orderData.success) {
        setMessage("Failed to create order. Try again.");
        setLoading(false);
        return;
      }

      const paymentResponse = await payWithMpesa(orderData.order._id, shippingInfo.phone);

      if (paymentResponse.success) {
        setMessage("✅ Order placed! Please complete payment on your phone.");
        clearCart();

        // ✅ Navigate to /orders automatically after success
        setTimeout(() => {
          navigate("/orders");
        }, 1500);

      } else {
        setMessage("⚠️ Order created but payment failed. Try again.");
      }

    } catch (err) {
      console.error(err);
      setMessage("⚠️ An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-container">

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          {cart.length === 0 ? <p>Your cart is empty.</p> : (
            <ul>
              {cart.map((item) => (
                <li key={item.productId}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>KES {item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <hr />
          <p><strong>Total Items:</strong> {getTotalItems()}</p>
          <p><strong>Total Price:</strong> KES {getTotalPrice()}</p>
        </div>

        <form className="shipping-form card" onSubmit={handleSubmit}>
          <h3>Shipping Information</h3>

          <label>
            Name:
            <input type="text" name="name" value={shippingInfo.name}
              onChange={handleChange} required placeholder="John Doe" />
          </label>

          <label>
            Phone:
            <input type="text" name="phone" value={shippingInfo.phone}
              onChange={handleChange} required placeholder="0712345678" />
          </label>

          <label>
            Apartment:
            <select name="apartment" value={shippingInfo.apartment} onChange={handleChange}>
              <option value="Apartment A">Apartment A</option>
              <option value="Apartment B">Apartment B</option>
              <option value="Apartment C">Apartment C</option>
              <option value="Apartment D">Apartment D</option>
            </select>
          </label>

          <label>
            Door Number:
            <input type="text" name="doorNumber" value={shippingInfo.doorNumber}
              onChange={handleChange} required placeholder="101" />
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
