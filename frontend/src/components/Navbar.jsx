import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Shop<span>Now</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shops">Shops</Link>
        <Link to="/category">Category</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>

      <div className="nav-right">
        <button className="search-btn">🔍</button>

        <Link to="/cart" className="cart-btn">
          Cart
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;