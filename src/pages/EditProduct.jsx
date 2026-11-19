import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../api/products.api";
import {
  getProductReviews,
  addProductReview,
  deleteProductReview,
} from "../api/review.api";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const [productRes, reviewsRes] = await Promise.all([
          getProductById(id),
          getProductReviews(id).catch(() => ({ data: {} })),
        ]);

        if (cancelled) return;

        const productData =
          productRes.data?.product || productRes.data?.data || productRes.data;

        setProduct(productData);

        const firstImg =
          productData?.images?.[0]?.url || productData?.images?.[0] || "";
        setSelectedImage(typeof firstImg === "string" ? firstImg : "");

        const revData = reviewsRes.data || {};
        setReviews(revData.reviews || productData?.reviews || []);
        setAverageRating(
          revData.averageRating ?? productData?.averageRating ?? 0
        );
        setNumReviews(revData.numReviews ?? productData?.numReviews ?? 0);
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.message || "Failed to load product details."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProductAndReviews();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refreshReviews = async () => {
    try {
      const res = await getProductReviews(id);
      const data = res.data || {};
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating ?? 0);
      setNumReviews(data.numReviews ?? 0);
    } catch (err) {
      console.error("Error refreshing reviews:", err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setReviewMessage("");
    setReviewError("");

    if (!comment.trim()) {
      setReviewError("Please write a comment before submitting your review.");
      return;
    }

    try {
      setSubmittingReview(true);
      await addProductReview(id, {
        rating: Number(rating),
        comment: comment.trim(),
      });
      setComment("");
      setRating(5);
      setReviewMessage("Review added successfully.");
      await refreshReviews();
    } catch (err) {
      setReviewError(
        err.response?.data?.message ||
          "Failed to add review. Make sure you are logged in."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    setReviewMessage("");
    setReviewError("");
    try {
      await deleteProductReview(id, reviewId);
      setReviewMessage("Review deleted.");
      await refreshReviews();
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Not authorized to delete this review."
      );
    }
  };

  if (loading) {
    return (
      <div className="product-details-state">Loading product details...</div>
    );
  }

  if (error) {
    return (
      <div className="product-details-state">
        <p className="product-details-error-text">{error}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="product-details-back-btn"
        >
          Back
        </button>
      </div>
    );
  }

  if (!product) {
    return <div className="product-details-state">Product not found.</div>;
  }

  const imagesList = Array.isArray(product.images) ? product.images : [];
  const tagsList = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div className="product-details-page">
      {/* Top Bar */}
      <div className="product-details-topbar">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="product-details-back-btn"
        >
          ← Back
        </button>

        <Link
          to={`/products/edit/${product._id || id}`}
          className="product-details-edit-link"
        >
          Edit Product
        </Link>
      </div>

      {/* Product Overview */}
      <div className="product-details-grid">
        {/* Gallery */}
        <div className="product-details-gallery">
          <div className="product-details-main-image-box">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="product-details-main-image"
              />
            ) : (
              <div className="product-details-no-image">No image available</div>
            )}
          </div>

          {imagesList.length > 1 && (
            <div className="product-details-thumbs">
              {imagesList.map((img, idx) => {
                const url = typeof img === "string" ? img : img.url;
                const key = img.public_id || url || idx;
                const isActive = selectedImage === url;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedImage(url)}
                    className={`product-details-thumb-btn ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${idx + 1}`}
                      className="product-details-thumb-img"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="product-details-info">
          <div>
            <p className="product-details-meta">
              {[product.category, product.subcategory, product.brand]
                .filter(Boolean)
                .join(" • ")}
            </p>
            <h1 className="product-details-title">{product.name}</h1>
          </div>

          {product.shortDescription && (
            <p className="product-details-short-desc">
              {product.shortDescription}
            </p>
          )}

          <div className="product-details-price-row">
            <span className="product-details-price-current">
              ${product.discountPrice ?? product.price}
            </span>
            {product.discountPrice != null &&
              product.price != null &&
              product.discountPrice < product.price && (
                <span className="product-details-price-old">
                  ${product.price}
                </span>
              )}
          </div>

          <div className="product-details-specs-grid">
            <div>
              <span className="product-details-spec-label">Stock: </span>
              <strong>{product.stock ?? 0}</strong>
            </div>
            <div>
              <span className="product-details-spec-label">SKU: </span>
              <strong>{product.sku || "-"}</strong>
            </div>
            <div>
              <span className="product-details-spec-label">Rating: </span>
              <strong>{Number(averageRating).toFixed(1)} ★</strong>
            </div>
            <div>
              <span className="product-details-spec-label">Reviews: </span>
              <strong>{numReviews}</strong>
            </div>
          </div>

          {product.description && (
            <div>
              <h2 className="product-details-section-heading">Description</h2>
              <p className="product-details-description">{product.description}</p>
            </div>
          )}

          {tagsList.length > 0 && (
            <div className="product-details-tags">
              {tagsList.map((tag, i) => (
                <span key={`${tag}-${i}`} className="product-details-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="product-reviews-section">
        <h2 className="product-reviews-heading">Reviews ({numReviews})</h2>

        {reviewMessage && (
          <p className="product-details-success-text">{reviewMessage}</p>
        )}
        {reviewError && (
          <p className="product-details-error-text">{reviewError}</p>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleAddReview} className="product-reviews-form">
          <div className="product-reviews-rating-row">
            <label htmlFor="rating-select" className="product-reviews-label">
              Rating:
            </label>
            <select
              id="rating-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="product-reviews-select"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="product-reviews-textarea"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="product-reviews-submit-btn"
          >
            {submittingReview ? "Submitting..." : "Add Review"}
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="product-reviews-empty">
            No reviews for this product yet.
          </p>
        ) : (
          <div className="product-reviews-list">
            {reviews.map((rev, idx) => {
              const revId = rev._id || rev.id || idx;
              return (
                <div key={revId} className="product-review-card">
                  <div>
                    <div className="product-review-author">
                      {rev.username || "User"}{" "}
                      <span className="product-review-stars">
                        • {rev.rating} ★
                      </span>
                    </div>
                    <p className="product-review-comment">{rev.comment}</p>
                  </div>

                  {rev._id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev._id)}
                      className="product-review-delete-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}