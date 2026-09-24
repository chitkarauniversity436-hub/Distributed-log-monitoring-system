function ProductCard({
  product,
  addToCart
}) {

  const imageUrl = product.image
    ? `http://localhost:3002${product.image}`
    : "https://via.placeholder.com/250";


  return (

    <div className="product-card">

      <img
        src={imageUrl}
        alt={product.name}
      />

      <h3>
        {product.name}
      </h3>

      <p>
        ₹{product.price}
      </p>

      <button
        onClick={() =>
          addToCart(product)
        }
      >
        Add to Cart
      </button>

    </div>

  );

}

export default ProductCard;