import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:5000/api",
   baseURL: "https://school-bus-backend-e4eu.onrender.com/api",
});

api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("token");

  console.log("TOKEN FROM STORAGE:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("REQUEST HEADERS:", config.headers);

  return config;
});

export default api;