
import api from "./axios";

// Send Registration OTP
export const sendRegisterOTP = (data) => {
  return api.post("/auth/register/send-otp", data);
};

// Verify Registration OTP
export const verifyRegisterOTP = (data) => {
  return api.post("/auth/register/verify-otp", data);
};

// Login
export const login = (data) => {
  return api.post("/auth/login", data);
};

// Logout
export const logout = () => {
  return api.post("/auth/logout");
};

// Send Forgot Password OTP
export const sendForgotPasswordOTP = (data) => {
  return api.post("/auth/forgot-password/send-otp", data);
};

// Verify OTP and Set New Password
export const resetPassword = (data) => {
  return api.post("/auth/forgot-password/verify-otp", data);
};

// Get Current User
export const getCurrentUser = () => {
  return api.get("/auth/me");
};
