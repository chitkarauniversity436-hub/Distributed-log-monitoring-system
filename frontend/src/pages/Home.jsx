import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

function Home() {
  const [cart, setCart] = useState([]);

  // Load cart from backend when page loads
  useEffect(() => {
    fetch("http://localhost:3000/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart);
      })
      .catch((error) => {
        console.log("Error fetching cart:", error);
      });
  }, []);

  const products = [
    {
      id: 1,
      name: "Casual Shirt",
      price: 799,
      image: "https://via.placeholder.com/250"
    },
    {
      id: 2,
      name: "Running Shoes",
      price: 1499,
      image: "https://via.placeholder.com/250"
    },
    {
      id: 3,
      name: "Backpack",
      price: 999,
      image: "https://via.placeholder.com/250"
    }
  ];

  // Add product to backend cart
  function addToCart(product) {
    fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend:", data);
        setCart(data.cart);
      })
      .catch((err) => {
        console.log("Error sending cart:", err);
      });
  }

  // Remove/decrease product from backend cart
  function removeFromCart(index) {
    const product = cart[index];

    fetch(`http://localhost:3000/api/cart/${product.productId || product.id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend:", data);
        setCart(data.cart);
      })
      .catch((error) => {
        console.log("Error removing product:", error);
      });
  }

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
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

export default Home;