const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getMyCourses,
  getCourseStudents,
  markAttendance,
  getCourseAttendance,
  uploadStudyMaterial,
  getMyStudyMaterials,
  deleteStudyMaterial,
  uploadGrades,
  publishGrade,
  getCourseGrades,
  sendAnnouncement,
} = require('../controllers/facultyController');
const { authenticate } = require('../middleware/auth');
const { isFaculty } = require('../middleware/roleCheck');
const { upload, handleUploadError } = require('../middleware/upload');
const { markAttendanceValidation, uploadGradeValidation, paginationValidation } = require('../middleware/validator');

// All routes require authentication and faculty role
router.use(authenticate, isFaculty);

router.get('/dashboard', getDashboard);
router.get('/courses', getMyCourses);
router.get('/courses/:courseId/students', getCourseStudents);
router.post('/attendance/mark', markAttendanceValidation, markAttendance);
router.get('/courses/:courseId/attendance', getCourseAttendance);
router.post('/study-materials/upload', upload.single('file'), handleUploadError, uploadStudyMaterial);
router.get('/study-materials', paginationValidation, getMyStudyMaterials);
router.delete('/study-materials/:id', deleteStudyMaterial);
router.post('/grades/upload', uploadGradeValidation, uploadGrades);
router.put('/grades/:id/publish', publishGrade);
router.get('/courses/:courseId/grades', getCourseGrades);
router.post('/announcements', sendAnnouncement);

module.exports = router;
