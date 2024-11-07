import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
});

export const signup = (email) => api.post('/signup', { email });
export const login = (email) => api.post('/login', { email });
