
import api from "./api/axios";

export const testApiConnection = async () => {
  try {
    console.log("Testing API Connection...");

    const response = await api.get("/products");

    console.log("API Connected Successfully!");
    console.log("Status:", response.status);
    console.log("Products:", response.data);

    return response.data;
  } catch (error) {
    console.error("API Connection Failed!");
    console.error("Error:", error.message);
    console.error("Response:", error.response?.data);

    throw error;
  }
};
