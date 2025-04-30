import axiosInstance from '../components/axiosInterceptor';


const API_BASE_URL =  'https://leaveapi.aultrapaints.com/api';
//const API_BASE_URL = 'http://localhost:5000/api'

console.log('API_BASE_URL:', API_BASE_URL);

export const ApiRequestService = {
  getAllEvents: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/events/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  createEvent: async (event) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/events/create`, event);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  updateEvent: async (event) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/events/update/${event.id}`, event);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/events/delete/${eventId}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },


  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/user/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (user) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/user`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (user) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/user/${user._id}`, user);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/user/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  searchUsers: async (payload: { search: string; page: number; limit: number }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/user/search`, payload);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  getUserLeaveBalances: async (userId: string, leaveType: string) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/user/leave-balances`, {
        userId,
        leaveType
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user leave balances:', error);
      throw error;
    }
  },

  getManagers: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/user/managers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },

  getManagerEmployeeLeaves: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/events/manager/employee-leaves`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee leaves for manager:', error);
      throw error;
    }
  },

  // POST: Approve or reject employee leave by manager
  managerLeaveAction: async (leaveActionData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/events/manager/leave-action`, leaveActionData);
      return response.data;
    } catch (error) {
      console.error('Error performing leave action:', error);
      throw error;
    }
  },

  getAllHolidays: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/holidays/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  },
};

