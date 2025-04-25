import axios from 'axios';


const API_BASE_URL = 'https://leaveapi.aultrapaints.com/api';

// const API_BASE_URL = 'http://localhost:5000/api'

export const AuthRequestService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
};

export default AuthRequestService;