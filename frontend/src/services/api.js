import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// Attach JWT token from localStorage to every request
API.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (_) {}
    }
    return config;
});

// Auto-logout on 401 (expired / invalid token)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    // Single-step password reset: verifies email exists then updates password immediately
    resetPassword: (email, newPassword) => API.post('/auth/reset-password', { email, newPassword }),
};

export const resumeAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return API.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getHistory: () => API.get('/resume/history'),
    getAnalysis: (id) => API.get(`/resume/${id}`),
    deleteAnalysis: (id) => API.delete(`/resume/${id}`),
};

export const jobAPI = {
    suggestJobs: (analysisId, query) => API.get(`/jobs/suggest?analysisId=${analysisId}&query=${query}`),
    getHistory: () => API.get('/jobs/history'),
};

export default API;
