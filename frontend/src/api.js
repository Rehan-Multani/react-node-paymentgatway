import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // 👈 Backend URL
});

export default API;
