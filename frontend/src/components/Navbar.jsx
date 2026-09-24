import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>

      <div className="nav-right">
        <button className="search-btn">🔍</button>

        <button onClick={handleLogout}>
          Logout
        </button>

        <Link to="/cart" className="cart-btn">
          Cart
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;