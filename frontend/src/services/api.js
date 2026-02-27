import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const loginUser = async (data) => (await API.post("/auth/login", data)).data;
export const signupUser = async (data) => (await API.post("/auth/signup", data)).data;

export const fetchIssues = async (params = {}) => (await API.get("/issues", { params })).data;
export const fetchIssueDetails = async (id) => (await API.get(`/issues/${id}`)).data;
export const fetchMyIssues = async () => (await API.get("/issues/my")).data;
export const reportIssue = async (data) => (await API.post("/issues", data)).data;
export const upvoteIssue = async (id) => (await API.post(`/issues/${id}/upvote`)).data;
export const addIssueComment = async (id, text) =>
  (await API.post(`/issues/${id}/comments`, { text })).data;

export const fetchAdminIssues = async () => (await API.get("/admin/issues")).data;
export const assignIssue = async (id, assignedTo) =>
  (await API.put(`/admin/issues/${id}/assign`, { assignedTo })).data;
export const updateIssueStatus = async (id, status) =>
  (await API.put(`/admin/issues/${id}/status`, { status })).data;
export const uploadIssueProof = async (id, proofUrl) =>
  (await API.post(`/admin/issues/${id}/proof`, { proofUrl })).data;

export const fetchSummary = async () => (await API.get("/analytics/summary")).data;
export const fetchIssuesByCategory = async () =>
  (await API.get("/analytics/issues-by-category")).data;
export const fetchResolutionTimes = async () =>
  (await API.get("/analytics/resolution-times")).data;
export const fetchIssueTrend = async () => (await API.get("/analytics/trend")).data;

export default API;
