function Cart({ cart, removeFromCart }) {
  let total = 0;

  for (let item of cart) {
    total += item.price * item.quantity;
  }

  return (
    <div className="cart-box">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} />

              <div className="item-info">
                <h4>{item.name}</h4>
                <p>₹{item.price} × {item.quantity}</p>
              </div>

              <button onClick={() => removeFromCart(index)}>
                Remove
              </button>
            </div>
          ))}

          <div className="cart-total">
            <h3>Total: ₹{total}</h3>

            <button className="checkout-btn">
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;