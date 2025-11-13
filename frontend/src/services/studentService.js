import api from './api';

/**
 * Student service
 */
const studentService = {
  /**
   * Get dashboard data
   */
  getDashboard: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  /**
   * Get profile
   */
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (data) => {
    const response = await api.put('/students/profile', data);
    return response.data;
  },

  /**
   * Get enrolled courses
   */
  getCourses: async (params) => {
    const response = await api.get('/students/courses', { params });
    return response.data;
  },

  /**
   * Register for course
   */
  registerCourse: async (courseId) => {
    const response = await api.post('/students/courses/register', { courseId });
    return response.data;
  },

  /**
   * Get attendance
   */
  getAttendance: async (params) => {
    const response = await api.get('/students/attendance', { params });
    return response.data;
  },

  /**
   * Get grades
   */
  getGrades: async () => {
    const response = await api.get('/students/grades');
    return response.data;
  },

  /**
   * Get timetable
   */
  getTimetable: async () => {
    const response = await api.get('/students/timetable');
    return response.data;
  },

  /**
   * Get study materials
   */
  getStudyMaterials: async (params) => {
    const response = await api.get('/students/study-materials', { params });
    return response.data;
  },

  /**
   * Request certificate
   */
  requestCertificate: async (data) => {
    const response = await api.post('/students/certificates/request', data);
    return response.data;
  },

  /**
   * Get certificate requests
   */
  getCertificateRequests: async () => {
    const response = await api.get('/students/certificates');
    return response.data;
  },

  /**
   * Get notifications
   */
  getNotifications: async (params) => {
    const response = await api.get('/students/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (id) => {
    const response = await api.put(`/students/notifications/${id}/read`);
    return response.data;
  },
};

export default studentService;
