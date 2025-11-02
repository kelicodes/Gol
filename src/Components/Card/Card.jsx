import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";

const Card = ({ id, name, price, desc, category, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <img src={image} alt={name} className="card-image" />
      <div className="card-info">
        <h3>{name}</h3>
        <p>KES {price}</p>
      </div>
    </div>
  );
};

export default Card;
