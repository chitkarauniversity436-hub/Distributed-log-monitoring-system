import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();

useEffect(() => {
  fetch("http://localhost:3002/api/products")
    .then((res) => {
      console.log("Response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Products received:", data);
      setProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}, []);
  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <p>WELCOME TO OUR STORE</p>

          <h1>
            Find what you
            <br />
            <span>love.</span>
          </h1>

          <p>
            Discover products you will love at
            affordable prices.
          </p>

          <button className="shop-btn">
            Shop Now
          </button>
        </div>
      </section>

      <section className="products">
        <h2>Popular Products</h2>

        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;