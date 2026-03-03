import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { getCategories, getProducts, getProductsByCategory } from "../../api/shopApi";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category"); 

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // load categories + all products (for counts)
  useEffect(() => {
    let cancelled = false;

    async function loadBase() {
      try {
        const [cats, all] = await Promise.all([
          getCategories(),
          getProducts(1, 500),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setAllProducts(all.items);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      }
    }

    loadBase();
    return () => (cancelled = true);
  }, []);

  // load products shown (filtered or all)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        if (categoryId) {
          const items = await getProductsByCategory(categoryId);
          if (!cancelled) setProducts(items);
        } else {
          const data = await getProducts(1, 50);
          if (!cancelled) setProducts(data.items);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, [categoryId]);

  // counts pr kategori
  const counts = useMemo(() => {
    const map = new Map(); // categoryId -> count
    for (const p of allProducts) {
      map.set(p.categoryId, (map.get(p.categoryId) || 0) + 1);
    }
    return map;
  }, [allProducts]);

  const selectedCategoryTitle =
    categoryId && categories.length
      ? categories.find((c) => String(c.id) === String(categoryId))?.title
      : "Alle";

  return (
    <>
      <div className="container">
        <h1 className="sectionTitle">Produkter</h1>

        {!loading && !err && (
          <p className="smallLabel">
            {selectedCategoryTitle} — {products.length} produkter
          </p>
        )}

        {loading && <p>Loading...</p>}
        {err && <p>{err}</p>}
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">
          {!loading && !err && <ProductGrid products={products} />}
        </div>
      </div>
    </>
  );
}