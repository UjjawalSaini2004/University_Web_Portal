/**
 * API Base URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Application name
 */
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'University Management Portal';

/**
 * User roles
 */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  FACULTY: 'faculty', // Keep for backward compatibility
};

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_PROFILE: '/student/profile',
  STUDENT_COURSES: '/student/courses',
  STUDENT_ATTENDANCE: '/student/attendance',
  STUDENT_GRADES: '/student/grades',
  STUDENT_TIMETABLE: '/student/timetable',
  STUDENT_MATERIALS: '/student/materials',
  STUDENT_CERTIFICATES: '/student/certificates',
  STUDENT_NOTIFICATIONS: '/student/notifications',
  
  // Faculty routes
  FACULTY_DASHBOARD: '/faculty/dashboard',
  FACULTY_PROFILE: '/faculty/profile',
  FACULTY_COURSES: '/faculty/courses',
  FACULTY_ATTENDANCE: '/faculty/attendance',
  FACULTY_GRADES: '/faculty/grades',
  FACULTY_MATERIALS: '/faculty/materials',
  FACULTY_STUDENTS: '/faculty/students',
  FACULTY_ANNOUNCEMENTS: '/faculty/announcements',
  
  // Teacher routes (same as faculty for now)
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_PROFILE: '/teacher/profile',
  TEACHER_COURSES: '/teacher/courses',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_GRADES: '/teacher/grades',
  TEACHER_MATERIALS: '/teacher/materials',
  TEACHER_STUDENTS: '/teacher/students',
  TEACHER_ANNOUNCEMENTS: '/teacher/announcements',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_FACULTY: '/admin/faculty',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_TIMETABLE: '/admin/timetable',
  ADMIN_CERTIFICATES: '/admin/certificates',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_WAITLIST: '/admin/waitlist',
  
  // Super Admin routes
  SUPER_ADMIN_DASHBOARD: '/superadmin/dashboard',
  SUPER_ADMIN_USERS: '/superadmin/users',
  SUPER_ADMIN_ADMINS: '/superadmin/admins',
  SUPER_ADMIN_WAITLIST: '/superadmin/waitlist',
  SUPER_ADMIN_SETTINGS: '/superadmin/settings',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

/**
 * Certificate types
 */
export const CERTIFICATE_TYPES = {
  BONAFIDE: 'bonafide',
  CHARACTER: 'character',
  COURSE_COMPLETION: 'course_completion',
  TRANSCRIPT: 'transcript',
};

/**
 * Attendance status
 */
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

/**
 * Days of week
 */
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Grade colors
 */
export const GRADE_COLORS = {
  'A+': 'text-green-600',
  'A': 'text-green-500',
  'B+': 'text-blue-600',
  'B': 'text-blue-500',
  'C': 'text-yellow-600',
  'D': 'text-orange-600',
  'F': 'text-red-600',
};

/**
 * Status colors
 */
export const STATUS_COLORS = {
  active: 'badge-success',
  inactive: 'badge-danger',
  pending: 'badge-warning',
  approved: 'badge-success',
  rejected: 'badge-danger',
  enrolled: 'badge-info',
  dropped: 'badge-danger',
  completed: 'badge-success',
};
