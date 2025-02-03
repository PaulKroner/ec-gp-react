import axios from 'axios';

const axiosInstanceAPI = axios.create({
  // baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost/php-backend/api",
  baseURL: "http://localhost/gewaltprävention-edv/php-backend/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Fügt Cookies in Anfragen hinzu
});

export default axiosInstanceAPI;