import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Spinner from "../../Components/Spinner/Spinner.jsx";
import Card from "../../Components/Card/Card.jsx";
import "./Collection.css";

const Collection = () => {
  const { products = [] } = useContext(ShopContext);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(true); // <-- loading state

  const categories = ["All", "Shoes", "Sweatpants", "Jackets", "Hoodies"];

  useEffect(() => {
    setLoading(true); // start loading

    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    let tempProducts = [...products];

    // Filter by category
    if (categoryFilter !== "All") {
      tempProducts = tempProducts.filter(
        (prod) => prod.category === categoryFilter
      );
    }

    // Sort products
    if (sortOption === "price-high") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "price-low") {
      tempProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(tempProducts);

    // small delay to simulate loading, optional
    setTimeout(() => setLoading(false), 300);

  }, [products, categoryFilter, sortOption]);

  return (
    <section className="collection">
      <h2 className="collection-title">Our Collection</h2>

      {/* Filter Controls */}
      <div className="collection-controls">
        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="collection-grid">
        {loading ? (
          <Spinner /> // <-- show spinner while loading
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Card
              key={index}
              id={product._id}
              name={product.name}
              price={product.price}
              desc={product.desc}
              category={product.category}
              image={product.images?.[0]}
            />
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Collection;
