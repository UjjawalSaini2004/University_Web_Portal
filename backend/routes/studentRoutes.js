const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  getEnrolledCourses,
  registerCourse,
  getAttendance,
  getGrades,
  getTimetable,
  getStudyMaterials,
  requestCertificate,
  getCertificateRequests,
  getNotifications,
  markNotificationAsRead,
} = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { isStudent } = require('../middleware/roleCheck');
const { certificateRequestValidation, paginationValidation } = require('../middleware/validator');

// All routes require authentication and student role
router.use(authenticate, isStudent);

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/courses', paginationValidation, getEnrolledCourses);
router.post('/courses/register', registerCourse);
router.get('/attendance', getAttendance);
router.get('/grades', getGrades);
router.get('/timetable', getTimetable);
router.get('/study-materials', paginationValidation, getStudyMaterials);
router.post('/certificates/request', certificateRequestValidation, requestCertificate);
router.get('/certificates', getCertificateRequests);
router.get('/notifications', paginationValidation, getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

module.exports = router;
