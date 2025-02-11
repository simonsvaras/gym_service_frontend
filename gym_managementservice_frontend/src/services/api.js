import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL_API, // URL, kde běží tvůj Spring backend
});

export default api;
