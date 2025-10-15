// lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8008", // FastAPI backend
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
