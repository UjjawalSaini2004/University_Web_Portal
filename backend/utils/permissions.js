const { ROLES } = require('./constants');

/**
 * Define permissions for each role
 */
const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    students: ['create', 'read', 'update', 'delete'],
    teachers: ['create', 'read', 'update', 'delete'],
    admins: ['create', 'read', 'update', 'delete'],
    departments: ['create', 'read', 'update', 'delete'],
    courses: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    system: ['manage']
  },
  [ROLES.ADMIN]: {
    students: ['create', 'read', 'update', 'delete'],
    teachers: ['create', 'read', 'update', 'delete'],
    admins: [], // NO access to admins
    departments: ['read'], // Read-only
    courses: ['create', 'read', 'update', 'delete'], // Full course management
    users: ['read'], // Can only read users, not manage admins
    settings: [], // NO access
    system: [] // NO access
  },
  [ROLES.TEACHER]: {
    students: ['read'],
    teachers: ['read'],
    courses: ['read', 'update'], // Can update their own courses
    grades: ['create', 'read', 'update'],
    attendance: ['create', 'read', 'update'],
    materials: ['create', 'read', 'update', 'delete']
  },
  [ROLES.STUDENT]: {
    courses: ['read'],
    grades: ['read'],
    attendance: ['read'],
    materials: ['read'],
    profile: ['read', 'update']
  }
};

/**
 * Check if a role has permission for an action on a resource
 * @param {string} role - User role (superadmin, admin, teacher, student)
 * @param {string} action - Action to perform (create, read, update, delete, manage)
 * @param {string} resource - Resource name (students, teachers, admins, etc.)
 * @returns {boolean} - True if permission granted
 */
const hasPermission = (role, action, resource) => {
  if (!role || !action || !resource) {
    return false;
  }

  // Super admin has all permissions
  if (role === ROLES.SUPER_ADMIN) {
    return true;
  }

  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) {
    return false;
  }

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) {
    return false;
  }

  return resourcePermissions.includes(action);
};

/**
 * Check if user can manage another user based on roles
 * @param {string} actorRole - Role of the user performing the action
 * @param {string} targetRole - Role of the user being acted upon
 * @returns {boolean} - True if allowed
 */
const canManageUser = (actorRole, targetRole) => {
  // Super admin can manage everyone
  if (actorRole === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Admin can manage students and teachers only
  if (actorRole === ROLES.ADMIN) {
    return [ROLES.STUDENT, ROLES.TEACHER, ROLES.FACULTY].includes(targetRole);
  }

  // Other roles cannot manage users
  return false;
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {object} - All permissions for the role
 */
const getRolePermissions = (role) => {
  return PERMISSIONS[role] || {};
};

/**
 * Check if role can access a specific section
 * @param {string} role - User role
 * @param {string} section - Section name (students, teachers, admins, etc.)
 * @returns {boolean} - True if can access
 */
const canAccessSection = (role, section) => {
  const permissions = PERMISSIONS[role];
  if (!permissions) return false;
  
  const sectionPermissions = permissions[section];
  return sectionPermissions && sectionPermissions.length > 0;
};

module.exports = {
  PERMISSIONS,
  hasPermission,
  canManageUser,
  getRolePermissions,
  canAccessSection
};
