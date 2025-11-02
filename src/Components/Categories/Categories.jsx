import React from "react";
import "./Categories.css";

const categories = [
  { 
    name: "Shoes", 
    image: "https://images.unsplash.com/photo-1598300059854-d101d99c1a9f?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Sweatpants", 
    image: "https://images.unsplash.com/photo-1593032465177-48f58c0d4e1b?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Jackets", 
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Hoodies", 
    image: "https://images.unsplash.com/photo-1602810318020-429a2e38b163?auto=format&fit=crop&w=800&q=80" 
  },
];

const Categories = () => {
  return (
    <section className="categories">
      <h2 className="categories-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.name} className="category-image" />
            <div className="category-info">
              <h3>{cat.name}</h3>
              <button className="btn-category">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
