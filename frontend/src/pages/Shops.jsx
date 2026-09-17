import { useState } from "react";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

function Shops() {
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: "T-Shirt",
      price: 599,
      image: "https://via.placeholder.com/250"
    },
    {
      id: 2,
      name: "Jeans",
      price: 1199,
      image: "https://via.placeholder.com/250"
    },
    {
      id: 3,
      name: "Sneakers",
      price: 1799,
      image: "https://via.placeholder.com/250"
    },
    {
      id: 4,
      name: "Watch",
      price: 999,
      image: "https://via.placeholder.com/250"
    }
  ];

  function addToCart(product) {
    setCart([...cart, product]);
  }

  function removeFromCart(index) {
    const newCart = [...cart];

    newCart.splice(index, 1);

    setCart(newCart);
  }

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
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
      />
    </main>
  );
}

export default Shops;