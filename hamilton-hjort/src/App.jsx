import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

export default function App() {
  return (

    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/category/:categoryId" element={<Products />} />

        {/* Single product: dynamisk side baseret på :id */}
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </MainLayout>
  );
}
