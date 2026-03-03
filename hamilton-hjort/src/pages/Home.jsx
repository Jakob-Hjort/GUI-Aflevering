import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { getProducts } from "../api/shopApi";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    getProducts(1, 3)
      .then((data) => setFeatured(data.items))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="sectionTitle">Nyheder og populære produkter</h2>
        {err && <p>{err}</p>}
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">
          {!err && <ProductGrid products={featured} variant="featured" />}
        </div>
      </div>
    </>
  );
}