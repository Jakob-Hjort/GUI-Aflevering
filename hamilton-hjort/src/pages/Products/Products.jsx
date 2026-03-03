import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGrid from "../../components/ProductGrid/ProductGrid";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
} from "../../api/shopApi";

export default function Products() {
  // categoryId kommer fra URL'en når vi er på /products/category/:categoryId
  // Hvis vi er på /products, så er categoryId = undefined
  const { categoryId } = useParams();

  // ---------- State (data) ----------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ---------- State (UI) ----------
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ---------- Effect 1: hent kategorier én gang (så vi kan vise titel) ----------
  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats))
      .catch((e) => {
        // Hvis kategorier fejler, kan vi stadig vise produkter,
        // så vi gemmer bare fejlen hvis du vil vise den.
        setErr(e.message);
      });
  }, []);

  // ---------- Effect 2: hent produkter (kører igen når categoryId ændrer sig) ----------
  useEffect(() => {
    setLoading(true);
    setErr("");

    // Hvis categoryId findes, henter vi produkter for en kategori
    if (categoryId) {
      getProductsByCategory(categoryId)
        .then((items) => setProducts(items))
        .catch((e) => setErr(e.message))
        .finally(() => setLoading(false));
      return;
    }

    // Ellers henter vi alle produkter (side 1, 50 stk)
    getProducts(1, 50)
      .then((data) => setProducts(data.items))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  // ---------- Hjælpe-tekst: hvilken kategori er valgt? ----------
  const selectedCategoryTitle = categoryId
    ? categories.find((c) => String(c.id) === String(categoryId))?.title ||
      "Kategori"
    : "Alle";

  // ---------- Render ----------
  return (
    <>
      <div className="container">
        <h1 className="sectionTitle">Produkter</h1>

        {/* Viser info når data er loaded */}
        {!loading && !err && (
          <p className="smallLabel">
            {selectedCategoryTitle} — {products.length} produkter
          </p>
        )}

        {/* Loading + fejl */}
        {loading && <p>Loading...</p>}
        {err && <p>{err}</p>}
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">
          {/* Vi viser kun grid når vi har data og ingen fejl */}
          {!loading && !err && <ProductGrid products={products} />}
        </div>
      </div>
    </>
  );
}
