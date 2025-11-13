const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isSuperAdmin } = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  getSuperAdminStats,
  createAdmin,
  addAdminToWaitlist,
  getPendingAdmins,
  approveAdmin,
  denyAdmin,
  deleteUser,
  updateUserRole,
  // Teacher Management
  getAllTeachers,
  getPendingTeachers,
  approveTeacher,
  denyTeacher,
  createTeacher,
  updateTeacher,
  // Student Management
  getAllStudents,
  getPendingStudents,
  approveStudent,
  denyStudent,
  createStudent,
  updateStudent,
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
  // Activity Logs
  getActivityLogsController,
  getRecentActivitiesController,
} = require('../controllers/superAdminController');

// All routes require super admin authentication
router.use(authenticate);
router.use(isSuperAdmin);

// Dashboard & Stats
router.get('/stats', getSuperAdminStats);
router.get('/activities/recent', getRecentActivitiesController);
router.get('/activities', getActivityLogsController);

// User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Admin Management
router.post('/admins/create', createAdmin);
router.post('/admins/waitlist', addAdminToWaitlist);
router.get('/admins/pending', getPendingAdmins);
router.post('/admins/:id/approve', approveAdmin);
router.post('/admins/:id/deny', denyAdmin);

// Teacher Management
router.get('/teachers', getAllTeachers);
router.get('/teachers/pending', getPendingTeachers);
router.post('/teachers/create', createTeacher);
router.post('/teachers/:id/approve', approveTeacher);
router.post('/teachers/:id/deny', denyTeacher);
router.put('/teachers/:id', updateTeacher);

// Student Management
router.get('/students', getAllStudents);
router.get('/students/pending', getPendingStudents);
router.post('/students/create', createStudent);
router.post('/students/:id/approve', approveStudent);
router.post('/students/:id/deny', denyStudent);
router.put('/students/:id', updateStudent);

// Course Management
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.put('/courses/:id/assign-teachers', assignTeachersToCourse);

// Certificate Management
router.get('/certificates', getAllCertificates);
router.post('/certificates/:id/approve', approveCertificate);
router.post('/certificates/:id/reject', rejectCertificate);

// Department Management
router.get('/departments', getAllDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

module.exports = router;
