const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  assignFacultyToCourse,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  manageTimetable,
  getCertificateRequests,
  approveCertificate,
  rejectCertificate,
} = require('../controllers/adminController');
const {
  getWaitlistUsers,
  getWaitlistStats,
  approveWaitlistUser,
  denyWaitlistUser,
  deleteWaitlistUser,
} = require('../controllers/waitlistController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleMiddleware');
const { checkPermission } = require('../middleware/roleCheck');
const { registerValidation, createCourseValidation, paginationValidation, idValidation } = require('../middleware/validator');

// All routes require authentication and admin role (includes super_admin)
router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Waitlist management - Both admin and super_admin allowed
router.get('/waitlist', paginationValidation, getWaitlistUsers);
router.get('/waitlist/stats', getWaitlistStats);
router.post('/waitlist/:id/approve', idValidation, approveWaitlistUser);
router.post('/waitlist/:id/deny', idValidation, denyWaitlistUser);
router.delete('/waitlist/:id', idValidation, deleteWaitlistUser);

// Student management - Both admin and super_admin allowed
router.get('/students', checkPermission('read', 'students'), paginationValidation, getStudents);
router.post('/students', checkPermission('create', 'students'), registerValidation, addStudent);
router.put('/students/:id', checkPermission('update', 'students'), idValidation, updateStudent);
router.delete('/students/:id', checkPermission('delete', 'students'), idValidation, deleteStudent);

// Faculty/Teacher management - Both admin and super_admin allowed
router.get('/faculty', checkPermission('read', 'teachers'), paginationValidation, getFaculty);
router.post('/faculty', checkPermission('create', 'teachers'), registerValidation, addFaculty);
router.put('/faculty/:id', checkPermission('update', 'teachers'), idValidation, updateFaculty);
router.delete('/faculty/:id', checkPermission('delete', 'teachers'), idValidation, deleteFaculty);
router.put('/courses/:courseId/assign-faculty', assignFacultyToCourse);

// Department management - Read-only for admin, full for super_admin
router.get('/departments', checkPermission('read', 'departments'), getDepartments);
router.post('/departments', checkPermission('create', 'departments'), createDepartment);
router.put('/departments/:id', checkPermission('update', 'departments'), idValidation, updateDepartment);
router.delete('/departments/:id', checkPermission('delete', 'departments'), idValidation, deleteDepartment);

// Course management - Read-only for admin, full for super_admin
router.get('/courses', checkPermission('read', 'courses'), paginationValidation, getCourses);
router.post('/courses', checkPermission('create', 'courses'), createCourseValidation, createCourse);
router.put('/courses/:id', checkPermission('update', 'courses'), idValidation, updateCourse);
router.delete('/courses/:id', checkPermission('delete', 'courses'), idValidation, deleteCourse);

// Timetable management
router.post('/timetables', manageTimetable);

// Certificate management
router.get('/certificates', paginationValidation, getCertificateRequests);
router.put('/certificates/:id/approve', idValidation, approveCertificate);
router.put('/certificates/:id/reject', idValidation, rejectCertificate);

module.exports = router;
