import api from "./axios";

// Get All Products
export const getProducts = (params = {}) => {
  return api.get("/products", { params });
};

// Search Products
export const searchProducts = (params = {}) => {
  return api.get("/products/search", { params });
};

// Get Single Product
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

// Update Product (Admin) - multipart/form-data
export const updateProduct = (id, formData) => {
  return api.patch(`/products/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};