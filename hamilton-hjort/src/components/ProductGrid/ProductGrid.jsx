import ProductCard from "../ProductCard/ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products = [], variant = "compact" }) {
  return (
    <div className="productGrid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} variant={variant} />
      ))}
    </div>
  );
}