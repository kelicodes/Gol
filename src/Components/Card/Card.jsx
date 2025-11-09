import React, { useContext } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  

  const handleAddToCart = () => {
     const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); // redirect to login if not logged in
    return;
  }
    addToCart({ _id: id, name, price, category, images: [image], quantity: 1 });
  };

  const handleBuyNow = () => {
     const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login"); // redirect to login if not logged in
    return;
  }
    // Add product to cart and redirect to checkout
    addToCart({ _id: id, name, price, category, images: [image], quantity: 1 });
    navigate("/checkout");
  };

  return (
    <Link to={`/product/${id}`}>
    <div className="card">
      
        <img src={image} alt={name} className="card-image" />
     
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-desc">{desc}</p>
        <p className="card-category">{category}</p>
        <div className="card-footer">
          <span className="card-price">KES {price}</span>
          <div className="card-buttons">
            <button className="btn-add-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
     </Link>
  );
};

export default Card;
