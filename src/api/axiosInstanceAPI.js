import axios from 'axios';

const axiosInstanceAPI = axios.create({
  baseURL: process.env.REACT_APP_GP_EDV_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstanceAPI;