import axiosInstance from '../config/axios';

export const authService = {
    login: async (username: string, password: string) => {
        const response = await axiosInstance.post('/auth/login', {
            username,
            password,
        });
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },

    // Add more auth-related methods
};