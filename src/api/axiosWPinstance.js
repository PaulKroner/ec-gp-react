import axios from 'axios';

const axiosWPinstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost/wordpress/index.php/wp-json',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosWPinstance;