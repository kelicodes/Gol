import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  

  return (
    <Link to={`/product/${id}`} className="card-link">
      <div className="card">
        <img src={image || "/placeholder.png"} alt={name} className="card-image" />
        <div className="card-info">
          <h3>{name}</h3>
          <p>KES {price}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
