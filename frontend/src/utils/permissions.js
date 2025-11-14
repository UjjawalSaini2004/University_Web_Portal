import { ROLES } from './constants';

/**
 * Define permissions for each role - matches backend
 */
export const PERMISSIONS = {
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
    courses: ['read'], // Read-only
    users: ['read'], // Can only read users, not manage admins
    settings: [], // NO access
    system: [] // NO access
  },
  [ROLES.TEACHER]: {
    students: ['read'],
    teachers: ['read'],
    courses: ['read', 'update'],
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
 * @param {string} role - User role (super_admin, admin, teacher, student)
 * @param {string} action - Action to perform (create, read, update, delete, manage)
 * @param {string} resource - Resource name (students, teachers, admins, etc.)
 * @returns {boolean} - True if permission granted
 */
export const hasPermission = (role, action, resource) => {
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
export const canManageUser = (actorRole, targetRole) => {
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
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || {};
};

/**
 * Check if role can access a specific section
 * @param {string} role - User role
 * @param {string} section - Section name (students, teachers, admins, etc.)
 * @returns {boolean} - True if can access
 */
export const canAccessSection = (role, section) => {
  const permissions = PERMISSIONS[role];
  if (!permissions) return false;
  
  const sectionPermissions = permissions[section];
  return sectionPermissions && sectionPermissions.length > 0;
};

/**
 * Check if user can perform action - accepts user object
 * @param {object} user - User object with role property
 * @param {string} action - Action to perform
 * @param {string} resource - Resource name
 * @returns {boolean} - True if allowed
 */
export const canPerformAction = (user, action, resource) => {
  if (!user || !user.role) return false;
  return hasPermission(user.role, action, resource);
};

/**
 * Check if user can access section - accepts user object
 * @param {object} user - User object with role property
 * @param {string} section - Section name
 * @returns {boolean} - True if can access
 */
export const canUserAccessSection = (user, section) => {
  if (!user || !user.role) return false;
  return canAccessSection(user.role, section);
};

/**
 * Get filtered navigation items based on user role
 * @param {string} role - User role
 * @param {array} navItems - Array of navigation items with 'id' property
 * @returns {array} - Filtered navigation items
 */
export const getFilteredNavigation = (role, navItems) => {
  if (!role || !navItems) return [];
  
  return navItems.filter(item => {
    // Dashboard and settings are available to all
    if (['dashboard', 'settings'].includes(item.id)) {
      return true;
    }
    
    // Check if user has access to this section
    return canAccessSection(role, item.id);
  });
};
