const { ROLES } = require('../utils/constants');
const { hasPermission, canManageUser } = require('../utils/permissions');
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
 * Check if user has permission for a specific action on a resource
 * @param {string} action - Action to perform (create, read, update, delete)
 * @param {string} resource - Resource name (students, teachers, admins, etc.)
 */
const checkPermission = (action, resource) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const userRole = req.user.role;
    
    if (!hasPermission(userRole, action, resource)) {
      logger.warn(`Permission denied: ${userRole} attempted ${action} on ${resource}`);
      return res.status(403).json({
        success: false,
        message: `You do not have permission to ${action} ${resource}.`,
      });
    }

    next();
  };
};

/**
 * Check if user can manage the target user
 */
const canManageTargetUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  try {
    const User = require('../models/User');
    const targetUserId = req.params.id || req.params.userId;
    
    if (!targetUserId) {
      return next();
    }

    const targetUser = await User.findById(targetUserId).select('role');
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found.',
      });
    }

    const actorRole = req.user.role;
    const targetRole = targetUser.role;

    if (!canManageUser(actorRole, targetRole)) {
      logger.warn(`User management denied: ${actorRole} attempted to manage ${targetRole}`);
      return res.status(403).json({
        success: false,
        message: `You cannot manage users with role: ${targetRole}.`,
      });
    }

    // Attach target user role to request for further use
    req.targetUserRole = targetRole;
    next();
  } catch (error) {
    logger.error(`Error in canManageTargetUser middleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking permissions.',
    });
  }
};

/**
 * Check if user is student
 */
const isStudent = authorize(ROLES.STUDENT);

/**
 * Check if user is faculty
 */
const isFaculty = authorize(ROLES.FACULTY, ROLES.TEACHER);

/**
 * Check if user is admin or super admin
 */
const isAdmin = authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN);

/**
 * Check if user is super admin only
 */
const isSuperAdmin = authorize(ROLES.SUPER_ADMIN);

/**
 * Check if user is faculty or admin
 */
const isFacultyOrAdmin = authorize(ROLES.FACULTY, ROLES.TEACHER, ROLES.ADMIN, ROLES.SUPER_ADMIN);

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
  
  if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role) || 
      req.user._id.toString() === resourceUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You do not have permission to access this resource.',
  });
};

module.exports = {
  authorize,
  checkPermission,
  canManageTargetUser,
  isStudent,
  isFaculty,
  isAdmin,
  isSuperAdmin,
  isFacultyOrAdmin,
  isOwnerOrAdmin,
};
