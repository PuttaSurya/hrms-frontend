import axiosInstance from '../components/axiosInterceptor';


const API_BASE_URL =  'https://leaveapi.aultrapaints.com/api';

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
};