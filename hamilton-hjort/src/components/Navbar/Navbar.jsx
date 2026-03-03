import { useEffect, useState } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { getCategories } from "../../api/shopApi";
import "./Navbar.css";

export default function Navbar() {
  const [cats, setCats] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const activeCategory = searchParams.get("category"); // string | null
  const onHome = location.pathname === "/";
  const onProducts = location.pathname === "/products";

  useEffect(() => {
    getCategories().then(setCats).catch(() => {});
  }, []);

  const cls = (active) => (active ? "tab active" : "tab");

  return (
    <div className="navbar">
      <div className="navbarTabsBar">
        <nav className="navbarTabs">
          {/* Home */}
          <NavLink to="/" className={() => cls(onHome)}>
            Home
          </NavLink>

          {/* Alle produkter (kun aktiv på /products uden category) */}
          <NavLink
            to="/products"
            className={() => cls(onProducts && !activeCategory)}
          >
            Alle produkter
          </NavLink>

          {/* Kategorier (kun aktiv på /products?category=ID) */}
          {cats.map((c) => (
            <NavLink
              key={c.id}
              to={`/products?category=${c.id}`}
              className={() => cls(onProducts && activeCategory === String(c.id))}
            >
              {c.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}