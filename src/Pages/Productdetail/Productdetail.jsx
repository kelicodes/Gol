import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const foundProduct = products.find((p) => p.id.toString() === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setMainImage(foundProduct.images[0]);
    }
  }, [id, products]);

  if (!product) return <p className="loading">Loading product...</p>;

  return (
    <section className="product-detail">
      <div className="product-images">
        <img src={mainImage} alt={product.name} className="main-image" />
        <div className="thumbnail-images">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name}-${idx}`}
              className={img === mainImage ? "active-thumb" : ""}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-price">KES {product.price}</p>
        <p className="product-desc">{product.desc}</p>

        <button className="btn-add-cart" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default ProductDetail;
