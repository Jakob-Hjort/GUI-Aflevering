import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { getCategories, getProducts, getProductsByCategory } from "../../api/shopApi";

export default function Products() {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (categoryId) {
      getProductsByCategory(categoryId).then(setProducts);
      return;
    }

    getProducts(1, 50).then((data) => setProducts(data.items));
  }, [categoryId]);

  const selectedCategoryTitle = categoryId
    ? categories.find((c) => String(c.id) === String(categoryId))?.title || "Kategori"
    : "Alle";

  if (!products.length) {
    return (
      <div className="container">
        <h1 className="sectionTitle">Produkter</h1>
        <p>Henter produkter...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <h1 className="sectionTitle">Produkter</h1>
        <p className="smallLabel">
          {selectedCategoryTitle} — {products.length} produkter
        </p>
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">
          <ProductGrid products={products} />
        </div>
      </div>
    </>
  );
}