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
  assignFacultyToCourse,
  getDepartments,
  createDepartment,
  updateDepartment,
  getCourses,
  createCourse,
  updateCourse,
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
const { registerValidation, createCourseValidation, paginationValidation, idValidation } = require('../middleware/validator');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Waitlist management
router.get('/waitlist', paginationValidation, getWaitlistUsers);
router.get('/waitlist/stats', getWaitlistStats);
router.post('/waitlist/:id/approve', idValidation, approveWaitlistUser);
router.post('/waitlist/:id/deny', idValidation, denyWaitlistUser);
router.delete('/waitlist/:id', idValidation, deleteWaitlistUser);

// Student management
router.get('/students', paginationValidation, getStudents);
router.post('/students', registerValidation, addStudent);
router.put('/students/:id', idValidation, updateStudent);
router.delete('/students/:id', idValidation, deleteStudent);

// Faculty management
router.get('/faculty', paginationValidation, getFaculty);
router.post('/faculty', registerValidation, addFaculty);
router.put('/courses/:courseId/assign-faculty', assignFacultyToCourse);

// Department management
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', idValidation, updateDepartment);

// Course management
router.get('/courses', paginationValidation, getCourses);
router.post('/courses', createCourseValidation, createCourse);
router.put('/courses/:id', idValidation, updateCourse);

// Timetable management
router.post('/timetables', manageTimetable);

// Certificate management
router.get('/certificates', paginationValidation, getCertificateRequests);
router.put('/certificates/:id/approve', idValidation, approveCertificate);
router.put('/certificates/:id/reject', idValidation, rejectCertificate);

module.exports = router;
