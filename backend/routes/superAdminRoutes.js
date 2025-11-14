const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isSuperAdmin } = require('../middleware/roleMiddleware');
const { canManageTargetUser, checkPermission } = require('../middleware/roleCheck');
const {
  getAllUsers,
  getSuperAdminStats,
  createAdmin,
  addAdminToWaitlist,
  getPendingAdmins,
  approveAdmin,
  denyAdmin,
  getAdminDetails,
  deleteAdmin,
  deactivateAdmin,
  deleteUser,
  updateUserRole,
  // Admin Registration Approval
  getPendingAdminRegistrations,
  approveAdminRegistration,
  rejectAdminRegistration,
  // Teacher Management
  getAllTeachers,
  getPendingTeachers,
  getTeacherDetails,
  approveTeacher,
  denyTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  // Student Management
  getAllStudents,
  getStudentDetails,
  getPendingStudents,
  approveStudent,
  denyStudent,
  createStudent,
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

// User Management - Super Admin Only
router.get('/users', checkPermission('read', 'users'), getAllUsers);
router.delete('/users/:id', checkPermission('delete', 'users'), canManageTargetUser, deleteUser);
router.put('/users/:id/role', checkPermission('update', 'users'), canManageTargetUser, updateUserRole);

// Admin Management - Super Admin Only
console.log('🔧 Registering admin management routes...');
router.post('/admins/create', checkPermission('create', 'admins'), createAdmin);
router.post('/admins/waitlist', checkPermission('create', 'admins'), addAdminToWaitlist);
router.get('/admins/pending', checkPermission('read', 'admins'), getPendingAdmins);
router.get('/admins/:id', checkPermission('read', 'admins'), getAdminDetails);
router.post('/admins/:id/approve', checkPermission('update', 'admins'), approveAdmin);
router.post('/admins/:id/deny', checkPermission('update', 'admins'), denyAdmin);
router.delete('/admins/:id', (req, res, next) => {
  console.log('🗑️ DELETE /admins/:id route hit! ID:', req.params.id);
  next();
}, checkPermission('delete', 'admins'), deleteAdmin);
router.post('/admins/:id/deactivate', checkPermission('update', 'admins'), deactivateAdmin);
console.log('✅ Admin management routes registered');

// Admin Registration Approval - Super Admin Only
router.get('/admin-registrations/pending', checkPermission('read', 'admins'), getPendingAdminRegistrations);
router.post('/admin-registrations/:id/approve', checkPermission('update', 'admins'), approveAdminRegistration);
router.post('/admin-registrations/:id/reject', checkPermission('update', 'admins'), rejectAdminRegistration);

// Teacher Management
router.get('/teachers', checkPermission('read', 'teachers'), getAllTeachers);
router.get('/teachers/pending', checkPermission('read', 'teachers'), getPendingTeachers);
router.get('/teachers/:id', checkPermission('read', 'teachers'), getTeacherDetails);
router.post('/teachers/create', checkPermission('create', 'teachers'), createTeacher);
router.post('/teachers/:id/approve', checkPermission('update', 'teachers'), approveTeacher);
router.post('/teachers/:id/deny', checkPermission('update', 'teachers'), denyTeacher);
router.put('/teachers/:id', checkPermission('update', 'teachers'), canManageTargetUser, updateTeacher);
router.delete('/teachers/:id', checkPermission('delete', 'teachers'), canManageTargetUser, deleteTeacher);

// Student Management
router.get('/students', checkPermission('read', 'students'), getAllStudents);
router.get('/students/pending', checkPermission('read', 'students'), getPendingStudents);
router.get('/students/:id', checkPermission('read', 'students'), getStudentDetails);
router.post('/students/create', checkPermission('create', 'students'), createStudent);
router.post('/students/:id/approve', checkPermission('update', 'students'), approveStudent);
router.post('/students/:id/deny', checkPermission('update', 'students'), denyStudent);
router.put('/students/:id', checkPermission('update', 'students'), canManageTargetUser, updateStudent);
router.delete('/students/:id', checkPermission('delete', 'students'), canManageTargetUser, deleteStudent);

// Course Management - Super Admin Only
router.get('/courses', checkPermission('read', 'courses'), getAllCourses);
router.post('/courses', checkPermission('create', 'courses'), createCourse);
router.put('/courses/:id', checkPermission('update', 'courses'), updateCourse);
router.delete('/courses/:id', checkPermission('delete', 'courses'), deleteCourse);
router.put('/courses/:id/assign-teachers', checkPermission('update', 'courses'), assignTeachersToCourse);

// Certificate Management
router.get('/certificates', getAllCertificates);
router.post('/certificates/:id/approve', approveCertificate);
router.post('/certificates/:id/reject', rejectCertificate);

// Department Management - Super Admin Only
router.get('/departments', checkPermission('read', 'departments'), getAllDepartments);
router.post('/departments', checkPermission('create', 'departments'), createDepartment);
router.put('/departments/:id', checkPermission('update', 'departments'), updateDepartment);
router.delete('/departments/:id', checkPermission('delete', 'departments'), deleteDepartment);

module.exports = router;
