import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  let total = 0;

  for (const item of cart) {
    total += item.price * item.quantity;
  }

  return (
    <div className="cart-box">

      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => {

            const imageUrl = item.image
              ? `http://localhost:3002${item.image}`
              : "https://via.placeholder.com/100";

            return (
              <div
                className="cart-item"
                key={item.productId}
              >

                <img
                  src={imageUrl}
                  alt={item.name}
                />

                <div className="item-info">

                  <h4>{item.name}</h4>

                  <p>
                    ₹{item.price}
                  </p>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.productId)
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.productId)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.productId)
                  }
                >
                  Remove
                </button>

              </div>
            );
          })}

          <div className="cart-total">
            <h3>
              Total: ₹{total}
            </h3>

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