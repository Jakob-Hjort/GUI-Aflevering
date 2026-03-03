import { useEffect, useState } from "react";

import Hero from "../components/Hero/Hero";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { getProducts } from "../api/shopApi";

export default function Home() {
  // ---------- State til "featured" produkter ----------
  const [featured, setFeatured] = useState([]);

  // ---------- State til fejlbesked ----------
  const [err, setErr] = useState("");

  // ---------- useEffect uden dependency: kør kun én gang ved load ----------
  useEffect(() => {
    getProducts(1, 3)
      .then((data) => setFeatured(data.items))
      .catch((e) => setErr(e.message));
  }, []);

  // ---------- Render ----------
  return (
    <>

      <Hero
        title="Velkommen til vores webshop"
        subtitle="Se udvalgte produkter herunder – eller hop direkte til alle produkter."
      />

      {/* Sektion: featured */}
      <div className="container">
        <h2 className="sectionTitle">Nyheder og populære produkter</h2>

        {err && <p>{err}</p>}
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">

          {!err && <ProductGrid products={featured} variant="featured" />}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 60 }}>
        <h3 className="sectionTitle">Sådan fungerer shoppen</h3>
        <p>
          Vælg en kategori i navigationen, se produkterne på products-siden, og klik
          ind på et produkt for at se detaljer på single product-siden.
        </p>
      </div>
    </>
  );
}
