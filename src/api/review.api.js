
import api from "./axios";

// Get Product Reviews
export const getProductReviews = (productId) => {
  return api.get(`/products/${productId}/reviews`);
};

// Add Product Review
export const addProductReview = (productId, data) => {
  return api.post(`/products/${productId}/reviews`, data);
};

// Delete Product Review
export const deleteProductReview = (productId, reviewId) => {
  return api.delete(
    `/products/${productId}/reviews/${reviewId}`
  );
};
