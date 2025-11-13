const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Check if user has required role
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user._id} with role ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Check if user is student
 */
const isStudent = authorize(ROLES.STUDENT);

/**
 * Check if user is faculty
 */
const isFaculty = authorize(ROLES.FACULTY);

/**
 * Check if user is admin
 */
const isAdmin = authorize(ROLES.ADMIN);

/**
 * Check if user is faculty or admin
 */
const isFacultyOrAdmin = authorize(ROLES.FACULTY, ROLES.ADMIN);

/**
 * Check if user is accessing their own resource or is admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const resourceUserId = req.params.userId || req.params.id;
  
  if (req.user.role === ROLES.ADMIN || req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You do not have permission to access this resource.',
  });
};

module.exports = {
  authorize,
  isStudent,
  isFaculty,
  isAdmin,
  isFacultyOrAdmin,
  isOwnerOrAdmin,
};
