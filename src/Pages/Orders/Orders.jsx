import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Orders.css";

const Orders = () => {
  const { fetchUserOrders } = useContext(ShopContext); // function to fetch orders from backend
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchUserOrders(); // call context method
        setOrders(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [fetchUserOrders]);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p className="loading">No orders found.</p>;

  return (
    <section className="orders">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Total:</strong> KES{" "}
              {order.totalAmount?.toFixed(2) || order.total?.toFixed(2)}
            </p>
            <p>
              <strong>Items:</strong>{" "}
              {order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
