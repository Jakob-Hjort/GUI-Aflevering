import { Link } from "react-router-dom";
import { imgSrc } from "../../api/shopApi";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const firstImage = product?.imageUrls?.[0] || "";

  return (
    <Link to={`/products/${product.id}`} className="productCard">
      <div className="productCardImageWrap">
        <div className="productCardImageFrame">
          {firstImage ? (
            <img
              className="productCardImage"
              src={imgSrc(firstImage)}
              alt={product.title}
              loading="lazy"
            />
          ) : (
            <div className="productCardPlaceholder" />
          )}
        </div>
      </div>

      <div className="productCardBody">
        <p className="productCardTitle">{product.title}</p>
        <p className="productCardPrice">kr. {Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}