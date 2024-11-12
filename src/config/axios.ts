import axios from 'axios';
import { message } from 'antd';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add auth token here
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle different error status codes
            switch (error.response.status) {
                case 401:
                    message.error('Unauthorized. Please login again.');
                    // Handle logout or refresh token
                    break;
                case 403:
                    message.error('Forbidden access');
                    break;
                case 404:
                    message.error('Resource not found');
                    break;
                case 500:
                    message.error('Internal server error');
                    break;
                default:
                    message.error('An error occurred');
            }
        } else if (error.request) {
            message.error('Network error');
        } else {
            message.error('An error occurred');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;