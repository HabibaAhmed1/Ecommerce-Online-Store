
import api from "./axios";

// Place New Order
export const placeOrder = (data) => {
  return api.post("/orders", data);
};

// Get My Orders
export const getMyOrders = (params = {}) => {
  return api.get("/orders/my", { params });
};

// Get Single Order
export const getOrderById = (id) => {
  return api.get(`/orders/my/${id}`);
};

// Cancel Order
export const cancelOrder = (id) => {
  return api.patch(`/orders/my/${id}/cancel`);
};
