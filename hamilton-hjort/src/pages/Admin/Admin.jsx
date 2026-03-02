import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  deleteProductImage,
  getCategories,
  getProducts,
  getProduct,
  imgSrc,
  uploadProductImages,
} from "../../api/shopApi";

export default function Admin() {
  const [msg, setMsg] = useState("");
  const [cats, setCats] = useState([]);
  const [products, setProducts] = useState([]);

  // create category
  const [newCatTitle, setNewCatTitle] = useState("");

  // create product
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [categoryId, setCategoryId] = useState("");

  // upload images
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [files, setFiles] = useState([]);

  async function refreshAll() {
    const [c, p] = await Promise.all([getCategories(), getProducts(1, 200)]);
    setCats(c);
    setProducts(p.items);
    if (!categoryId && c.length) setCategoryId(String(c[0].id));
    if (!selectedProductId && p.items.length) setSelectedProductId(String(p.items[0].id));
  }

  useEffect(() => {
    refreshAll().catch((e) => setMsg(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    getProduct(selectedProductId)
      .then(setSelectedProduct)
      .catch((e) => setMsg(e.message));
  }, [selectedProductId]);

  const productsByCat = useMemo(() => {
    const map = new Map();
    for (const c of cats) map.set(c.id, []);
    for (const p of products) {
      if (!map.has(p.categoryId)) map.set(p.categoryId, []);
      map.get(p.categoryId).push(p);
    }
    return map;
  }, [cats, products]);

  async function onCreateCategory(e) {
    e.preventDefault();
    setMsg("");
    try {
      await createCategory(newCatTitle);
      setNewCatTitle("");
      await refreshAll();
      setMsg("Kategori oprettet ✅");
    } catch (e2) {
      setMsg(e2.message);
    }
  }

  async function onCreateProduct(e) {
    e.preventDefault();
    setMsg("");
    try {
      const created = await createProduct({
        title,
        description,
        price,
        categoryId,
      });
      setMsg(`Produkt oprettet ✅ (id: ${created.id})`);
      setTitle("");
      setDescription("");
      setPrice("0");
      await refreshAll();
      setSelectedProductId(String(created.id));
    } catch (e2) {
      setMsg(e2.message);
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    setMsg("");
    try {
      if (!selectedProductId) return setMsg("Vælg et produkt.");
      if (!files.length) return setMsg("Vælg mindst 1 billede.");

      await uploadProductImages(selectedProductId, files);
      setFiles([]);
      setMsg("Billeder uploadet ✅");
      const updated = await getProduct(selectedProductId);
      setSelectedProduct(updated);
      await refreshAll();
    } catch (e2) {
      setMsg(e2.message);
    }
  }

  async function onDeleteCategory(id) {
    setMsg("");
    try {
      await deleteCategory(id);
      setMsg("Kategori slettet ✅");
      await refreshAll();
    } catch (e) {
      setMsg(e.message); // fx “Cannot delete category that has products.”
    }
  }

  async function onDeleteProduct(id) {
    setMsg("");
    try {
      await deleteProduct(id);
      setMsg("Produkt slettet ✅");
      await refreshAll();
      if (String(id) === String(selectedProductId)) {
        setSelectedProductId("");
        setSelectedProduct(null);
      }
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function onDeleteImage(imageId) {
    setMsg("");
    try {
      await deleteProductImage(selectedProductId, imageId);
      setMsg("Billede slettet ✅");
      const updated = await getProduct(selectedProductId);
      setSelectedProduct(updated);
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div className="container">
      <h1 className="sectionTitle">Admin</h1>
      {msg && <p className="smallLabel">{msg}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <form onSubmit={onCreateCategory} className="adminCard">
          <h2 className="adminCardTitle">Kategorier</h2>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              className="adminInput"
              value={newCatTitle}
              onChange={(e) => setNewCatTitle(e.target.value)}
              placeholder="Ny kategori"
            />
            <button className="adminBtn" type="submit">Opret</button>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
            {cats.map((c) => (
              <li key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>{c.title}</span>
                <button className="adminBtn adminBtnDanger" type="button" onClick={() => onDeleteCategory(c.id)}>
                  Slet
                </button>
              </li>
            ))}
          </ul>
        </form>

        <form onSubmit={onCreateProduct} className="adminCard">
          <h2 className="adminCardTitle">Opret produkt</h2>

          <input className="adminInput" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <textarea className="adminTextarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <input className="adminInput" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

          <select className="adminInput" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <button className="adminBtn" type="submit">Opret</button>
        </form>
      </div>

      <div className="adminCard" style={{ marginTop: 18 }}>
        <h2 className="adminCardTitle">Produkter</h2>

        {cats.map((c) => (
          <div key={c.id} style={{ marginBottom: 14 }}>
            <p className="smallLabel" style={{ marginBottom: 6 }}>{c.title}</p>
            <div style={{ display: "grid", gap: 6 }}>
              {(productsByCat.get(c.id) || []).map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                  <span>{p.title}</span>
                  <button className="adminBtn adminBtnDanger" type="button" onClick={() => onDeleteProduct(p.id)}>
                    Slet
                  </button>
                </div>
              ))}
              {(productsByCat.get(c.id) || []).length === 0 && (
                <span style={{ color: "var(--muted)" }}>Ingen produkter</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onUpload} className="adminCard" style={{ marginTop: 18 }}>
        <h2 className="adminCardTitle">Upload billeder</h2>

        <label className="smallLabel">Vælg produkt</label>
        <select
          className="adminInput"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.id} — {p.title}
            </option>
          ))}
        </select>

        {selectedProduct && (
          <>
            <p className="smallLabel">Billeder på produktet:</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {(selectedProduct.imageUrls || []).map((u, idx) => (
                <div key={u} style={{ width: 120 }}>
                  <img src={imgSrc(u)} alt={selectedProduct.title} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 12 }} />
                  {/* Vi har ikke imageId i DTO, så delete kræver imageId -> se note nedenfor */}
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>#{idx + 1}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <input
          className="adminInput"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button className="adminBtn" type="submit">Upload</button>
      </form>

      <p className="smallLabel" style={{ marginTop: 10 }}>
        NOTE: For at kunne slette et specifikt billede fra Admin skal frontend kende <b>imageId</b>. Lige nu returnerer dit API kun URL’er.
        Hvis du vil, kan vi udvide API’et til at returnere imageId sammen med Url (så bliver delete image nemt).
      </p>
    </div>
  );
}