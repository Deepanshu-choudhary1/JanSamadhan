import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL (adjust later)
});

// Add JWT auth header automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth APIs (dummy for now)
export const loginUser = async (data) => {
  return { token: "fake-jwt-token", user: { id: 1, name: "John Doe", role: "citizen" } };
};

export const signupUser = async (data) => {
  return { token: "fake-jwt-token", user: { id: 1, name: data.name, role: "citizen" } };
};
