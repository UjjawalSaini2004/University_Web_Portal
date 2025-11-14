import api from './api';

const BASE_URL = '/superadmin';

// ==================== DASHBOARD & STATS ====================

export const getSuperAdminStats = async () => {
  const response = await api.get(`${BASE_URL}/stats`);
  return response.data;
};

export const getRecentActivities = async (limit = 10) => {
  const response = await api.get(`${BASE_URL}/activities/recent`, {
    params: { limit },
  });
  return response.data;
};

export const getActivityLogs = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/activities`, { params });
  return response.data;
};

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/users`, { params });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`${BASE_URL}/users/${userId}`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`${BASE_URL}/users/${userId}/role`, { role });
  return response.data;
};

// ==================== ADMIN MANAGEMENT ====================

export const createAdmin = async (adminData) => {
  const response = await api.post(`${BASE_URL}/admins/create`, adminData);
  return response.data;
};

export const addAdminToWaitlist = async (adminData) => {
  const response = await api.post(`${BASE_URL}/admins/waitlist`, adminData);
  return response.data;
};

export const getPendingAdmins = async () => {
  const response = await api.get(`${BASE_URL}/admins/pending`);
  return response.data;
};

export const approveAdmin = async (adminId) => {
  const response = await api.post(`${BASE_URL}/admins/${adminId}/approve`);
  return response.data;
};

export const denyAdmin = async (adminId, reason) => {
  const response = await api.post(`${BASE_URL}/admins/${adminId}/deny`, { reason });
  return response.data;
};

// ==================== TEACHER MANAGEMENT ====================

export const getAllTeachers = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/teachers`, { params });
  return response.data;
};

export const getPendingTeachers = async () => {
  const response = await api.get(`${BASE_URL}/teachers/pending`);
  return response.data;
};

export const createTeacher = async (teacherData) => {
  const response = await api.post(`${BASE_URL}/teachers/create`, teacherData);
  return response.data;
};

export const approveTeacher = async (teacherId) => {
  const response = await api.post(`${BASE_URL}/teachers/${teacherId}/approve`);
  return response.data;
};

export const denyTeacher = async (teacherId, reason) => {
  const response = await api.post(`${BASE_URL}/teachers/${teacherId}/deny`, { reason });
  return response.data;
};

export const updateTeacher = async (teacherId, updates) => {
  const response = await api.put(`${BASE_URL}/teachers/${teacherId}`, updates);
  return response.data;
};

export const deleteTeacher = async (teacherId) => {
  const response = await api.delete(`${BASE_URL}/teachers/${teacherId}`);
  return response.data;
};

// ==================== STUDENT MANAGEMENT ====================

export const getAllStudents = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/students`, { params });
  return response.data;
};

export const getPendingStudents = async () => {
  const response = await api.get(`${BASE_URL}/students/pending`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await api.post(`${BASE_URL}/students/create`, studentData);
  return response.data;
};

export const approveStudent = async (studentId) => {
  const response = await api.post(`${BASE_URL}/students/${studentId}/approve`);
  return response.data;
};

export const denyStudent = async (studentId, reason) => {
  const response = await api.post(`${BASE_URL}/students/${studentId}/deny`, { reason });
  return response.data;
};

export const updateStudent = async (studentId, updates) => {
  const response = await api.put(`${BASE_URL}/students/${studentId}`, updates);
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await api.delete(`${BASE_URL}/students/${studentId}`);
  return response.data;
};

// ==================== COURSE MANAGEMENT ====================

export const getAllCourses = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/courses`, { params });
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post(`${BASE_URL}/courses`, courseData);
  return response.data;
};

export const updateCourse = async (courseId, updates) => {
  const response = await api.put(`${BASE_URL}/courses/${courseId}`, updates);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`${BASE_URL}/courses/${courseId}`);
  return response.data;
};

export const assignTeachersToCourse = async (courseId, faculty) => {
  const response = await api.put(`${BASE_URL}/courses/${courseId}/assign-teachers`, { faculty });
  return response.data;
};

// ==================== CERTIFICATE MANAGEMENT ====================

export const getAllCertificates = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/certificates`, { params });
  return response.data;
};

export const approveCertificate = async (certificateId) => {
  const response = await api.post(`${BASE_URL}/certificates/${certificateId}/approve`);
  return response.data;
};

export const rejectCertificate = async (certificateId, reason) => {
  const response = await api.post(`${BASE_URL}/certificates/${certificateId}/reject`, { reason });
  return response.data;
};

// ==================== DEPARTMENT MANAGEMENT ====================

export const getAllDepartments = async () => {
  const response = await api.get(`${BASE_URL}/departments`);
  return response.data;
};

export const createDepartment = async (departmentData) => {
  const response = await api.post(`${BASE_URL}/departments`, departmentData);
  return response.data;
};

export const updateDepartment = async (departmentId, updates) => {
  const response = await api.put(`${BASE_URL}/departments/${departmentId}`, updates);
  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(`${BASE_URL}/departments/${departmentId}`);
  return response.data;
};

const superAdminService = {
  // Dashboard & Stats
  getSuperAdminStats,
  getRecentActivities,
  getActivityLogs,
  // User Management
  getAllUsers,
  deleteUser,
  updateUserRole,
  // Admin Management
  createAdmin,
  addAdminToWaitlist,
  getPendingAdmins,
  approveAdmin,
  denyAdmin,
  // Teacher Management
  getAllTeachers,
  getPendingTeachers,
  createTeacher,
  approveTeacher,
  denyTeacher,
  updateTeacher,
  deleteTeacher,
  // Student Management
  getAllStudents,
  getPendingStudents,
  createStudent,
  approveStudent,
  denyStudent,
  updateStudent,
  deleteStudent,
  // Course Management
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTeachersToCourse,
  // Certificate Management
  getAllCertificates,
  approveCertificate,
  rejectCertificate,
  // Department Management
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default superAdminService;
