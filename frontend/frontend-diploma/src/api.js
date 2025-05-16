import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      console.log(refreshToken);
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post('/api/token/refresh/', {
          refresh: refreshToken
        });

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
const notifyAuthChange = () => {
  window.dispatchEvent(new Event('storage'));
};

const redirectToLogin = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  notifyAuthChange();
  window.location.href = '/login';
};

export default axiosInstance;
