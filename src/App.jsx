import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { getProducts } from "./api/products.api";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";
import "./App.css";

function ProductsQuickBar() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    getProducts()
      .then((res) => {
        const list =
          res.data?.products ||
          res.data?.data?.products ||
          res.data?.data ||
          (Array.isArray(res.data) ? res.data : []);
        const validList = Array.isArray(list) ? list : [];
        setProducts(validList);
        if (validList.length > 0) {
          setSelectedId(validList[0]._id || validList[0].id || "");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <nav
      style={{
        boxSizing: "border-box",
        textAlign: "left",
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        padding: "14px 18px",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {selectedId ? (
        <>
          <Link
            to={`/products/${selectedId}`}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Product Details
          </Link>
          <Link
            to={`/products/edit/${selectedId}`}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #06b6d4, #2563eb)",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Edit Product
          </Link>
        </>
      ) : (
        <span style={{ color: "#475569", fontSize: "14px" }}>
          Loading products from API...
        </span>
      )}

      {products.slice(0, 5).map((p) => {
        const pid = p._id || p.id;
        const isSelected = pid === selectedId;
        return (
          <Link
            key={pid}
            to={`/products/${pid}`}
            onClick={() => setSelectedId(pid)}
            style={{
              fontSize: "12px",
              padding: "6px 12px",
              borderRadius: "9999px",
              backgroundColor: isSelected ? "#e0f2fe" : "#f8fafc",
              border: isSelected ? "1px solid #0284c7" : "1px solid #cbd5e1",
              color: "#0f172a",
              textDecoration: "none",
            }}
          >
            {p.name || pid}
          </Link>
        );
      })}
    </nav>
  );
}

function HomePlaceholder() {
  return (
    <div
      style={{
        boxSizing: "border-box",
        textAlign: "left",
        padding: "24px",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
      }}
    >
      Select a product from the top bar to view details or edit it.
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          boxSizing: "border-box",
          minHeight: "100vh",
          backgroundColor: "#f1f5f9",
          color: "#0f172a",
          padding: "24px",
        }}
      >
        <ProductsQuickBar />

        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;