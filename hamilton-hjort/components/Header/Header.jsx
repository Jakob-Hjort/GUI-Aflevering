import Navbar from "../Navbar/Navbar";
import CategoryTabs from "../CategoryTabs/CategoryTabs";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <Navbar />

      <div className="headerRule" />

      <div className="container">
        <CategoryTabs />
      </div>
    </header>
  );
}