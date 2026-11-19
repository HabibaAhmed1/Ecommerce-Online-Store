
import api from "./axios";

// Get My Wishlist
export const getWishlist = () => {
  return api.get("/wishlists/my");
};

// Add Product To Wishlist
export const addToWishlist = (productId) => {
  return api.post(`/wishlists/add/${productId}`);
};

// Remove Product From Wishlist
export const removeFromWishlist = (productId) => {
  return api.delete(`/wishlists/remove/${productId}`);
};

// Clear Wishlist
export const clearWishlist = () => {
  return api.delete("/wishlists/clear");
};
