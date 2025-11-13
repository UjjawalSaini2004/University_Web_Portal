const { ROLES } = require('../utils/constants');

/**
 * Middleware to check if user is super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Super Admin access required.',
  });
};

/**
 * Middleware to check if user is admin (includes super admin)
 */
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === ROLES.ADMIN || req.user.role === ROLES.SUPER_ADMIN)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin access required.',
  });
};

/**
 * Middleware to check if user is teacher or above
 */
const isTeacher = (req, res, next) => {
  if (req.user && (
    req.user.role === ROLES.TEACHER ||
    req.user.role === ROLES.FACULTY ||
    req.user.role === ROLES.ADMIN ||
    req.user.role === ROLES.SUPER_ADMIN
  )) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Teacher access required.',
  });
};

/**
 * Middleware to check if user is student
 */
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === ROLES.STUDENT) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Student access required.',
  });
};

/**
 * Middleware to check if user has any of the specified roles
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}`,
    });
  };
};

/**
 * Middleware to check if user is verified
 */
const isVerified = (req, res, next) => {
  // Super admins bypass verification check
  if (req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }
  
  if (req.user && req.user.isVerified) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Your account is not approved yet. Please wait for admin verification.',
  });
};

module.exports = {
  isSuperAdmin,
  isAdmin,
  isTeacher,
  isStudent,
  hasRole,
  isVerified,
};
