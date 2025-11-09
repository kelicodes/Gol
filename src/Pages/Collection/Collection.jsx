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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // new toggle state

  const categories = ["All", "Shoes", "Sweatpants", "Jackets", "Hoodies"];

  useEffect(() => {
    setLoading(true);

    if (!Array.isArray(products) || products.length === 0) {
      setFilteredProducts([]);
      setLoading(true);
      return;
    }

    let tempProducts = [...products];

    // Filter by category
    if (categoryFilter !== "All") {
      tempProducts = tempProducts.filter(
        (prod) => prod.category === categoryFilter
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      tempProducts = tempProducts.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    if (sortOption === "price-high") {
      tempProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "price-low") {
      tempProducts.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(tempProducts);
    setLoading(false);
  }, [products, categoryFilter, sortOption, searchTerm]);

  return (
    <section className="collection">
      <h2 className="collection-title">Our Collection</h2>

      {/* Toggle Filters Button */}
      <div className="toggle-filters">
        <button onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Controls */}
      {showFilters && (
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

          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="collection-grid">
        {loading ? (
          <Spinner />
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
