import api from './api';

/**
 * Admin service
 */
const adminService = {
  /**
   * Get dashboard data
   */
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Student management
  getStudents: async (params) => {
    const response = await api.get('/admin/students', { params });
    return response.data;
  },

  addStudent: async (data) => {
    const response = await api.post('/admin/students', data);
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Faculty management
  getFaculty: async (params) => {
    const response = await api.get('/admin/faculty', { params });
    return response.data;
  },

  addFaculty: async (data) => {
    const response = await api.post('/admin/faculty', data);
    return response.data;
  },

  updateFaculty: async (id, data) => {
    const response = await api.put(`/admin/faculty/${id}`, data);
    return response.data;
  },

  deleteFaculty: async (id) => {
    const response = await api.delete(`/admin/faculty/${id}`);
    return response.data;
  },

  assignFacultyToCourse: async (courseId, facultyId) => {
    const response = await api.put(`/admin/courses/${courseId}/assign-faculty`, { facultyId });
    return response.data;
  },

  // Department management
  getDepartments: async () => {
    const response = await api.get('/admin/departments');
    return response.data;
  },

  createDepartment: async (data) => {
    const response = await api.post('/admin/departments', data);
    return response.data;
  },

  updateDepartment: async (id, data) => {
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/admin/departments/${id}`);
    return response.data;
  },

  // Course management
  getCourses: async (params) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },

  createCourse: async (data) => {
    const response = await api.post('/admin/courses', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/admin/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  // Timetable management
  manageTimetable: async (data) => {
    const response = await api.post('/admin/timetables', data);
    return response.data;
  },

  // Certificate management
  getCertificateRequests: async (params) => {
    const response = await api.get('/admin/certificates', { params });
    return response.data;
  },

  approveCertificate: async (id, data) => {
    const response = await api.put(`/admin/certificates/${id}/approve`, data);
    return response.data;
  },

  rejectCertificate: async (id, data) => {
    const response = await api.put(`/admin/certificates/${id}/reject`, data);
    return response.data;
  },

  // Waitlist management
  getWaitlistUsers: async (params) => {
    const response = await api.get('/admin/waitlist', { params });
    return response.data;
  },

  getWaitlistStats: async () => {
    const response = await api.get('/admin/waitlist/stats');
    return response.data;
  },

  approveWaitlistUser: async (id) => {
    const response = await api.post(`/admin/waitlist/${id}/approve`);
    return response.data;
  },

  denyWaitlistUser: async (id, data) => {
    const response = await api.post(`/admin/waitlist/${id}/deny`, data);
    return response.data;
  },

  deleteWaitlistUser: async (id) => {
    const response = await api.delete(`/admin/waitlist/${id}`);
    return response.data;
  },
};

export default adminService;
