import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/shopApi";
import "./Navbar.css";

export default function Navbar() {
  // State til kategorierne vi henter fra API'et
  const [cats, setCats] = useState([]);

  // useEffect uden dependency ([]) betyder: kør én gang når componenten loader
  useEffect(() => {
    // Hent kategorier fra API'et
    getCategories()
      .then((data) => setCats(data))
      .catch(() => {
        // Vi viser ikke fejl i navbaren - så den bare kan rende videre.
      });
  }, []);

  return (
    <div className="navbar">
      <div className="navbarTabsBar">
        <nav className="navbarTabs">
          {/* Link til forsiden */}
          <Link className="tab" to="/">
            Home
          </Link>

          {/* Link til alle produkter */}
          <Link className="tab" to="/products">
            Alle produkter
          </Link>

          {/* Links til produkter i en bestemt kategori */}
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
