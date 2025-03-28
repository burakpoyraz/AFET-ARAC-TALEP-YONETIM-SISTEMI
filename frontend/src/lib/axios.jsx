import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  withCredentials: true, // cookie gönderimi için şart
});

export default api;