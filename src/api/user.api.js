
import api from "./axios";

// Update User Profile
export const updateUserProfile = (userId, data) => {
  return api.patch(`/users/${userId}`, data);
};
