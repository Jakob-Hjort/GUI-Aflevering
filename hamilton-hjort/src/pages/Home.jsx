import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import { getProducts } from "../api/shopApi";
import Header from "../components/Header/Header"; // hvis din Header findes her

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
      <Header /> {/* behold hero/banner kun her */}
      <h2>Nyheder og populære produkter</h2>
      {err && <p>{err}</p>}
      {!err && <ProductGrid products={featured} />}
    </>
  );
}