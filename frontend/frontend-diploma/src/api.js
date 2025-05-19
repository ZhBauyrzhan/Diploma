import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-rough-wildflower-2218.fly.dev';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
let isRefreshing = false;
let failedRequestsQueue = [];

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return handleLogout();
      }

      try {
        const { data } = await axios.post(BASE_URL+'api/token/refresh/', { refresh: refreshToken });
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        failedRequestsQueue.forEach(prom => prom.resolve());
        failedRequestsQueue = [];
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        failedRequestsQueue.forEach(prom => prom.reject(refreshError));
        failedRequestsQueue = [];
        return handleLogout();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  delete axiosInstance.defaults.headers.common['Authorization'];
  window.location.href = '/login';
  return Promise.reject();
};

export default axiosInstance;
