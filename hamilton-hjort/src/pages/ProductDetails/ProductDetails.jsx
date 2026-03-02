 import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, imgSrc } from "../../api/shopApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErr("");
        const data = await getProduct(id);
        if (!cancelled) setProduct(data);
      } catch (e) {
        if (!cancelled) setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (err) return <p>{err}</p>;
  if (!product) return <p>Not found</p>;

  const images = product.imageUrls || [];

  return (
    <div>
      <Link to="/products">← Go back</Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 16 }}>
        <div>
          {images.length > 0 ? (
            <img
              src={imgSrc(images[0])}
              alt={product.title}
              style={{ width: "100%", maxWidth: 480, aspectRatio: "3/4", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", maxWidth: 480, aspectRatio: "3/4", background: "#eee" }} />
          )}

          {images.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {images.slice(1).map((u) => (
                <img
                  key={u}
                  src={imgSrc(u)}
                  alt={product.title}
                  style={{ width: 90, height: 90, objectFit: "cover" }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p style={{ opacity: 0.8 }}>{product.categoryTitle}</p>
          <h1 style={{ marginTop: 4 }}>{product.title}</h1>
          <p style={{ fontWeight: 600 }}>kr. {Number(product.price).toFixed(2)}</p>

          <button style={{ padding: "10px 14px", margin: "12px 0" }}>Add to cart</button>

          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}