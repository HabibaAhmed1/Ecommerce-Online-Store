import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../api/products.api";
import "./EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    tagsInput: "",
    featured: false,
    isActive: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getProductById(id);
        if (cancelled) return;

        const item = res.data?.product || res.data?.data || res.data;
        if (!item) {
          throw new Error("Product not found.");
        }

        const tagsArr = Array.isArray(item.tags) ? item.tags : [];

        setFormState({
          name: item.name || "",
          shortDescription: item.shortDescription || "",
          description: item.description || "",
          price: item.price ?? "",
          discountPrice: item.discountPrice ?? "",
          stock: item.stock ?? "",
          sku: item.sku || "",
          category: item.category || "",
          subcategory: item.subcategory || "",
          brand: item.brand || "",
          tagsInput: tagsArr.join(", "),
          featured: Boolean(item.featured),
          isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
        });

        setExistingImages(Array.isArray(item.images) ? item.images : []);
        setDeletedImages([]);
        setNewImages([]);
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product details."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRemoveExistingImage = (img) => {
    const publicId = typeof img === "string" ? img : img.public_id;
    if (publicId) {
      setDeletedImages((prev) =>
        prev.includes(publicId) ? prev : [...prev, publicId]
      );
    }
    setExistingImages((prev) =>
      prev.filter((item) => {
        const currentId =
          typeof item === "string" ? item : item.public_id || item.url;
        const targetId =
          typeof img === "string" ? img : img.public_id || img.url;
        return currentId !== targetId;
      })
    );
  };

  const handleNewImagesChange = (e) => {
    if (!e.target.files) return;
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      setSaving(true);

      const parsedTags = formState.tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("shortDescription", formState.shortDescription);
      formData.append("description", formState.description);
      if (formState.price !== "")
        formData.append("price", String(formState.price));
      if (formState.discountPrice !== "")
        formData.append("discountPrice", String(formState.discountPrice));
      if (formState.stock !== "")
        formData.append("stock", String(formState.stock));
      if (formState.sku !== "") formData.append("sku", formState.sku);
      if (formState.category !== "")
        formData.append("category", formState.category);
      if (formState.subcategory !== "")
        formData.append("subcategory", formState.subcategory);
      if (formState.brand !== "") formData.append("brand", formState.brand);

      formData.append("tags", JSON.stringify(parsedTags));
      formData.append("featured", String(Boolean(formState.featured)));
      formData.append("isActive", String(Boolean(formState.isActive)));
      formData.append("deletedImages", JSON.stringify(deletedImages));

      newImages.forEach((file) => {
        formData.append("images", file);
      });

      await updateProduct(id, formData);

      setSuccessMsg("Product updated successfully.");
      navigate(`/products/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update product. Please check your permissions or inputs."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-product-state">Loading product data...</div>;
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-header">
        <div>
          <h1 className="edit-product-title">Edit Product</h1>
          <p className="edit-product-subtitle">
            Review the current product data, add new images, remove existing
            ones, and save your updates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="edit-product-back-btn"
        >
          Back
        </button>
      </div>

      {error && <p className="edit-product-error-text">{error}</p>}
      {successMsg && <p className="edit-product-success-text">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="edit-product-field-group">
          <label htmlFor="edit-name" className="edit-product-label">
            Product Name *
          </label>
          <input
            id="edit-name"
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="edit-product-input"
          />
        </div>

        <div className="edit-product-field-group">
          <label htmlFor="edit-short-desc" className="edit-product-label">
            Short Description
          </label>
          <input
            id="edit-short-desc"
            type="text"
            name="shortDescription"
            value={formState.shortDescription}
            onChange={handleChange}
            className="edit-product-input"
          />
        </div>

        <div className="edit-product-field-group">
          <label htmlFor="edit-desc" className="edit-product-label">
            Description
          </label>
          <textarea
            id="edit-desc"
            name="description"
            rows={4}
            value={formState.description}
            onChange={handleChange}
            className="edit-product-input"
          />
        </div>

        <div className="edit-product-grid-4">
          <div className="edit-product-field-group">
            <label htmlFor="edit-price" className="edit-product-label">
              Price *
            </label>
            <input
              id="edit-price"
              type="number"
              step="any"
              name="price"
              value={formState.price}
              onChange={handleChange}
              required
              className="edit-product-input"
            />
          </div>

          <div className="edit-product-field-group">
            <label htmlFor="edit-discount" className="edit-product-label">
              Discount Price
            </label>
            <input
              id="edit-discount"
              type="number"
              step="any"
              name="discountPrice"
              value={formState.discountPrice}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>

          <div className="edit-product-field-group">
            <label htmlFor="edit-stock" className="edit-product-label">
              Stock
            </label>
            <input
              id="edit-stock"
              type="number"
              name="stock"
              value={formState.stock}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>

          <div className="edit-product-field-group">
            <label htmlFor="edit-sku" className="edit-product-label">
              SKU
            </label>
            <input
              id="edit-sku"
              type="text"
              name="sku"
              value={formState.sku}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>
        </div>

        <div className="edit-product-grid-3">
          <div className="edit-product-field-group">
            <label htmlFor="edit-category" className="edit-product-label">
              Category
            </label>
            <input
              id="edit-category"
              type="text"
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>

          <div className="edit-product-field-group">
            <label htmlFor="edit-subcategory" className="edit-product-label">
              Subcategory
            </label>
            <input
              id="edit-subcategory"
              type="text"
              name="subcategory"
              value={formState.subcategory}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>

          <div className="edit-product-field-group">
            <label htmlFor="edit-brand" className="edit-product-label">
              Brand
            </label>
            <input
              id="edit-brand"
              type="text"
              name="brand"
              value={formState.brand}
              onChange={handleChange}
              className="edit-product-input"
            />
          </div>
        </div>

        <div className="edit-product-field-group">
          <label htmlFor="edit-tags" className="edit-product-label">
            Tags (comma separated)
          </label>
          <input
            id="edit-tags"
            type="text"
            name="tagsInput"
            placeholder="wireless, audio, gaming"
            value={formState.tagsInput}
            onChange={handleChange}
            className="edit-product-input"
          />
        </div>

        <div className="edit-product-checkbox-row">
          <label className="edit-product-checkbox-label">
            <input
              type="checkbox"
              name="featured"
              checked={formState.featured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="edit-product-checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formState.isActive}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        {existingImages.length > 0 && (
          <div className="edit-product-field-group">
            <span className="edit-product-label">
              Current Images (click × to remove)
            </span>
            <div className="edit-product-images-list">
              {existingImages.map((img, idx) => {
                const url = typeof img === "string" ? img : img.url;
                const key = img.public_id || url || idx;
                return (
                  <div key={key} className="edit-product-image-card">
                    <img
                      src={url}
                      alt={`Product ${idx + 1}`}
                      className="edit-product-image-thumb"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img)}
                      title="Remove image"
                      className="edit-product-image-remove-btn"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="edit-product-field-group">
          <label htmlFor="edit-new-images" className="edit-product-label">
            Add More Images
          </label>
          <input
            id="edit-new-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImagesChange}
            className="edit-product-file-input"
          />
          {newImages.length > 0 && (
            <p className="edit-product-file-count">
              {newImages.length} new image(s) selected.
            </p>
          )}
        </div>

        <div className="edit-product-actions">
          <button
            type="submit"
            disabled={saving}
            className="edit-product-submit-btn"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="edit-product-cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}