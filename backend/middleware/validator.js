const { body, param, query, validationResult } = require('express-validator');
const { ROLES, CERTIFICATE_TYPES, ATTENDANCE_STATUS } = require('../utils/constants');

/**
 * Handle validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date of birth'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  validate,
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Validation rules for course creation
 */
const createCourseValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Course code is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Course name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required'),
  body('department')
    .isMongoId()
    .withMessage('Valid department ID is required'),
  body('credits')
    .isInt({ min: 1, max: 10 })
    .withMessage('Credits must be between 1 and 10'),
  body('semester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  body('type')
    .isIn(['theory', 'practical', 'theory_practical'])
    .withMessage('Invalid course type'),
  validate,
];

/**
 * Validation rules for attendance marking
 */
const markAttendanceValidation = [
  body('course')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('attendance')
    .isArray({ min: 1 })
    .withMessage('Attendance array is required'),
  body('attendance.*.student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('attendance.*.status')
    .isIn(Object.values(ATTENDANCE_STATUS))
    .withMessage('Invalid attendance status'),
  validate,
];

/**
 * Validation rules for grade upload
 */
const uploadGradeValidation = [
  body('student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  body('course')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('semester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  body('academicYear')
    .notEmpty()
    .withMessage('Academic year is required'),
  validate,
];

/**
 * Validation rules for certificate request
 */
const certificateRequestValidation = [
  body('certificateType')
    .isIn(Object.values(CERTIFICATE_TYPES))
    .withMessage('Invalid certificate type'),
  body('purpose')
    .trim()
    .notEmpty()
    .withMessage('Purpose is required'),
  validate,
];

/**
 * Validation rules for ObjectId param
 */
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

/**
 * Validation rules for pagination
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createCourseValidation,
  markAttendanceValidation,
  uploadGradeValidation,
  certificateRequestValidation,
  idValidation,
  paginationValidation,
};
