import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/shopApi";
import "./Navbar.css";

export default function Navbar() {
  // State til kategorierne vi henter fra API'et
  const [cats, setCats] = useState([]);

  useEffect(() => {
    // Hent kategorier fra API'et
    getCategories()
      .then((data) => setCats(data))
      .catch(() => {
      });
  }, []);

  return (
    <div className="navbar">
      <div className="navbarTabsBar">
        <nav className="navbarTabs">
          <Link className="tab" to="/">
            Home
          </Link>

          <Link className="tab" to="/products">
            Alle produkter
          </Link>

          {cats.map((c) => (
            <Link key={c.id} className="tab" to={`/products/category/${c.id}`}>
              {c.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
