import { useState, useEffect } from "react";
import { assets } from "../../assets/asssets.js";
import { Menu, X, Sun, Moon, ShoppingCart } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [cartCount, setCartCount] = useState(3); // example cart items

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  // Links array
  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <h2>
          Gold<span>Store</span>
        </h2>
      </div>

      {/* Links */}
      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={window.location.pathname === link.path ? "active" : ""}
              onClick={() => setMenuOpen(false)} // close menu on click
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Side */}
      <div className="navbar-right">
        {/* Cart Icon */}
        <div className="navbar-cart">
          <ShoppingCart size={24} />
          <span className="cart-count">{cartCount}</span>
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </div>

        {/* Profile */}
        <div className="navbar-profile">
          <img src={assets.profileimg} alt="Profile" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
