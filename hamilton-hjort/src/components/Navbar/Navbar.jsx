import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCategories } from "../../api/shopApi";
import "./Navbar.css";

export default function Navbar() {
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCats).catch(() => {});
  }, []);

  const tabClass = ({ isActive }) => (isActive ? "tab active" : "tab");

  return (
    <header className="navbar">
      <div className="navbarTop">
        <NavLink to="/" className="navbarBrand">
          HAMILTON-HJORT
        </NavLink>

        <button className="cartBtn" aria-label="Cart" onClick={() => navigate("/products")}>
          🛒
        </button>
      </div>

      <div className="navbarTabsBar">
        <nav className="navbarTabs">
          <NavLink to="/products" className={tabClass} end>
            Alle produkter
          </NavLink>

          {cats.map((c) => (
            <NavLink
              key={c.id}
              to={`/products?category=${c.id}`}
              className={tabClass}
              end
            >
              {c.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}