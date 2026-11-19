
import api from "./axios";

// Get My Cart
export const getCart = () => {
  return api.get("/carts");
};

// Add Item To Cart
export const addToCart = (data) => {
  return api.post("/carts/items", data);
};

// Update Cart Item Quantity
export const updateCartItem = (data) => {
  return api.patch("/carts/items", data);
};

// Remove Item From Cart
export const removeCartItem = (productId) => {
  return api.delete(`/carts/items/${productId}`);
};

// Apply Coupon
export const applyCoupon = (data) => {
  return api.post("/carts/coupon", data);
};

// Remove Coupon
export const removeCoupon = () => {
  return api.delete("/carts/coupon");
};

// Clear Cart
export const clearCart = () => {
  return api.delete("/carts/clear");
};
