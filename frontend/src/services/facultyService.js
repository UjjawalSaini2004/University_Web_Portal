import api from './api';

/**
 * Faculty service
 */
const facultyService = {
  /**
   * Get dashboard data
   */
  getDashboard: async () => {
    const response = await api.get('/faculty/dashboard');
    return response.data;
  },

  /**
   * Get my courses
   */
  getMyCourses: async () => {
    const response = await api.get('/faculty/courses');
    return response.data;
  },

  /**
   * Get course students
   */
  getCourseStudents: async (courseId) => {
    const response = await api.get(`/faculty/courses/${courseId}/students`);
    return response.data;
  },

  /**
   * Mark attendance
   */
  markAttendance: async (data) => {
    const response = await api.post('/faculty/attendance/mark', data);
    return response.data;
  },

  /**
   * Get course attendance
   */
  getCourseAttendance: async (courseId, params) => {
    const response = await api.get(`/faculty/courses/${courseId}/attendance`, { params });
    return response.data;
  },

  /**
   * Upload study material
   */
  uploadStudyMaterial: async (formData) => {
    const response = await api.post('/faculty/study-materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Get my study materials
   */
  getMyStudyMaterials: async (params) => {
    const response = await api.get('/faculty/study-materials', { params });
    return response.data;
  },

  /**
   * Delete study material
   */
  deleteStudyMaterial: async (id) => {
    const response = await api.delete(`/faculty/study-materials/${id}`);
    return response.data;
  },

  /**
   * Upload grades
   */
  uploadGrades: async (data) => {
    const response = await api.post('/faculty/grades/upload', data);
    return response.data;
  },

  /**
   * Publish grade
   */
  publishGrade: async (id) => {
    const response = await api.put(`/faculty/grades/${id}/publish`);
    return response.data;
  },

  /**
   * Get course grades
   */
  getCourseGrades: async (courseId) => {
    const response = await api.get(`/faculty/courses/${courseId}/grades`);
    return response.data;
  },

  /**
   * Send announcement
   */
  sendAnnouncement: async (data) => {
    const response = await api.post('/faculty/announcements', data);
    return response.data;
  },
};

export default facultyService;
