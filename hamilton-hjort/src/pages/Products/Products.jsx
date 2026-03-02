import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { getProducts, getProductsByCategory } from "../../api/shopApi";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

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

  return (
  <>
    <div className="container">
      <h1 className="sectionTitle">Produkter</h1>
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