import axios from 'axios';
import { BASE_URL } from './apiPath';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept:"application/json",
    },
})

// Request Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error Please Try Again");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request Timeout.Please Try Again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance