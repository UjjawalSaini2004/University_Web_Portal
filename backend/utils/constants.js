/**
 * Application constants
 */

// User roles
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  FACULTY: 'faculty', // Keep for backward compatibility
};

// Waitlist status
const WAITLIST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
};

// Certificate types
const CERTIFICATE_TYPES = {
  BONAFIDE: 'bonafide',
  CHARACTER: 'character',
  COURSE_COMPLETION: 'course_completion',
  TRANSCRIPT: 'transcript',
};

// Certificate request status
const CERTIFICATE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Attendance status
const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Course status
const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  COMPLETED: 'completed',
};

// Enrollment status
const ENROLLMENT_STATUS = {
  ENROLLED: 'enrolled',
  DROPPED: 'dropped',
  COMPLETED: 'completed',
};

// Notification types
const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: 'announcement',
  GRADE_UPDATE: 'grade_update',
  ATTENDANCE: 'attendance',
  COURSE_MATERIAL: 'course_material',
  CERTIFICATE: 'certificate',
  GENERAL: 'general',
};

// Days of week
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Semesters
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// Grade scale
const GRADE_SCALE = {
  'A+': { min: 90, max: 100 },
  'A': { min: 80, max: 89 },
  'B+': { min: 70, max: 79 },
  'B': { min: 60, max: 69 },
  'C': { min: 50, max: 59 },
  'D': { min: 40, max: 49 },
  'F': { min: 0, max: 39 },
};

// File upload limits
const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/jpg'],
};

module.exports = {
  ROLES,
  WAITLIST_STATUS,
  CERTIFICATE_TYPES,
  CERTIFICATE_STATUS,
  ATTENDANCE_STATUS,
  COURSE_STATUS,
  ENROLLMENT_STATUS,
  NOTIFICATION_TYPES,
  DAYS_OF_WEEK,
  SEMESTERS,
  GRADE_SCALE,
  FILE_LIMITS,
};
