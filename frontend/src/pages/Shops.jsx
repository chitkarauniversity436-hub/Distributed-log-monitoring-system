import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

function Shops() {
  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:3002/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <main className="page">
      <h1>Our Shop</h1>

      <p className="page-text">
        Browse our collection and find something
        that suits you.
      </p>

      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </main>
  );
}

export default Shops;