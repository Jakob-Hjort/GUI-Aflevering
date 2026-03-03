import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="heroInner">
        <div className="container">
        <div className="hero_Text">
          <h1 className="hero_Title">{title}</h1>
          <p className="hero_Subtitle">{subtitle}</p>

          <div className="heroActions">
            <Link className="heroBtn" to="/products">
              Se alle produkter
            </Link>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
