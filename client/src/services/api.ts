import axios from 'axios';

// Connect directly to backend Express server on port 5001 to avoid Vite http-proxy 500 errors
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || 'localhost';
    return `http://${hostname}:5001/api`;
  }
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchHealth() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
