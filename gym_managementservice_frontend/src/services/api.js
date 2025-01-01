import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // URL, kde běží tvůj Spring backend
});

export default api;
