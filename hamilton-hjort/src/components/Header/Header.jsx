import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="topHeader">
      <div className="container topHeaderInner">
        {/* Link til forsiden */}
        <Link to="/" className="topHeaderBrand">
          HAMILTON-HJORT
        </Link>

        {/* Link til products (ikon-knap) */}
        <Link className="topHeaderCart" aria-label="Cart" to="/products">
          🛒
        </Link>
      </div>
    </header>
  );
}
