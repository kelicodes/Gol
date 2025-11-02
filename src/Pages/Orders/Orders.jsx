import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Orders.css";

const Orders = () => {
  const { userOrders } = useContext(ShopContext); // assume context has userOrders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // if using context
    if (userOrders) setOrders(userOrders);

    // OR fetch from API
    // fetch("/api/orders")
    //   .then(res => res.json())
    //   .then(data => setOrders(data))
    //   .catch(err => console.error(err));
  }, [userOrders]);

  if (!orders || orders.length === 0)
    return <p className="loading">No orders found.</p>;

  return (
    <section className="orders">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div key={index} className="order-card">
            <p>
              <strong>Order ID:</strong> {order._id || order.id || index + 1}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
            <p>
              <strong>Total:</strong> KES {order.total.toFixed(2)}
            </p>
            <p>
              <strong>Items:</strong> {order.items.map(i => i.name).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
