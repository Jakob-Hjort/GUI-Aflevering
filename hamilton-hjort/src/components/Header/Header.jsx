import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="topHeader">
      <div className="container topHeaderInner">
        <NavLink to="/" className="topHeaderBrand">
          HAMILTON-HJORT
        </NavLink>

        <button
          className="topHeaderCart"
          aria-label="Cart"
          onClick={() => navigate("/products")}
        >
          🛒
        </button>
      </div>
    </header>
  );
}