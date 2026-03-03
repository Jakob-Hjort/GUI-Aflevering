import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, imgSrc } from "../../api/shopApi";
import "./ProductDetails.css";

export default function ProductDetails() {
  // :id fra URL (/products/:id)
  const { id } = useParams();

  // Data-state
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState("");

  // UI-state (kun loading)
  const [loading, setLoading] = useState(true);

  // Hent produktet når id ændrer sig
  useEffect(() => {
    setLoading(true);

    getProduct(id).then((data) => {
      setProduct(data);
      setActiveImg(data?.imageUrls?.[0] || "");
      setLoading(false);
    });
  }, [id]);

  // Loading UI
  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  // Hvis produktet ikke findes (eller API returnerer null)
  if (!product) {
    return (
      <div className="container">
        <p>Not found</p>
      </div>
    );
  }

  const images = product.imageUrls || [];

  return (
    <>
      <div className="container">
        <Link to="/products" className="backLink">
          ← Go back
        </Link>
      </div>

      <div className="sectionBox">
        <div className="container sectionBoxInner">
          <div className="pdLayout">
            <div>
              <div className="pdMainImageFrame">
                {activeImg ? (
                  <img
                    className="pdMainImage"
                    src={imgSrc(activeImg)}
                    alt={product.title}
                  />
                ) : (
                  <div className="pdPlaceholder" />
                )}
              </div>

              {/* Thumbnail row (kun hvis der er flere billeder) */}
              {images.length > 1 && (
                <div className="pdThumbRow">
                  {images.map((u) => (
                    <button
                      key={u}
                      type="button"
                      className={`pdThumb ${u === activeImg ? "active" : ""}`}
                      onClick={() => setActiveImg(u)}
                    >
                      <img src={imgSrc(u)} alt={product.title} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Højre side: info */}
            <div className="pdInfo">
              <p className="smallLabel">{product.categoryTitle}</p>
              <h1 className="pdTitle">{product.title}</h1>
              <p className="pdPrice">kr. {Number(product.price).toFixed(2)}</p>

              <button className="pdBtn" type="button">
                Add to cart
              </button>

              <h3 className="pdH3">Description</h3>
              <p className="pdDesc">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}