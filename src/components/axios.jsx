import axios from "axios";

// Create an instance of axios
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your API base URL
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Token found:", token); // Log token if present
      config.headers["Authorization"] = `Bearer ${token}`; // Set 'Authorization' header
    } else {
      console.error("No token found in localStorage"); // Log if token is not found
    }
    console.log("Request headers:", config.headers); // Log headers before sending request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);
