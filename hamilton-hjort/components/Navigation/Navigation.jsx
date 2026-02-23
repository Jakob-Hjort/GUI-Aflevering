import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="container navbarInner">
        <NavLink to="/" className="navBrand">
          AURA//EDIT
        </NavLink>

        <nav className="navLinks">
          <NavLink to="/" className="navLink">
            Home
          </NavLink>

          <NavLink to="/products" className="navLink">
            Products
          </NavLink>

          <NavLink to="/products" className="navLink navIcon" title="Cart">
            🛒
          </NavLink>
        </nav>
      </div>
    </div>
  );
}