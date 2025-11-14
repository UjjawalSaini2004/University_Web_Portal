const User = require('../models/User');
const WaitlistUser = require('../models/WaitlistUser');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Certificate = require('../models/Certificate');
const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');
const { createActivityLog, getActivityLogs, getRecentActivities } = require('../utils/activityLogger');

/**
 * Get all users with filtering and pagination
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, verified, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .populate('verifiedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics for super admin
 */
const getSuperAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: ROLES.STUDENT });
    const totalTeachers = await User.countDocuments({ role: ROLES.FACULTY });
    const totalAdmins = await User.countDocuments({ role: ROLES.ADMIN });
    const totalSuperAdmins = await User.countDocuments({ role: ROLES.SUPER_ADMIN });
    
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const pendingUsers = await User.countDocuments({ isVerified: false });
    
    const waitlistUsers = await WaitlistUser.countDocuments({ status: 'pending' });
    const waitlistStudents = await WaitlistUser.countDocuments({ role: 'student', status: 'pending' });
    const waitlistTeachers = await WaitlistUser.countDocuments({ role: 'teacher', status: 'pending' });
    const waitlistAdmins = await WaitlistUser.countDocuments({ role: 'admin', status: 'pending' });

    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });
    
    const totalDepartments = await Department.countDocuments();
    
    const pendingCertificates = await Certificate.countDocuments({ status: 'pending' });
    const approvedCertificates = await Certificate.countDocuments({ status: 'approved' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          teachers: totalTeachers,
          admins: totalAdmins,
          superAdmins: totalSuperAdmins,
          verified: verifiedUsers,
          pending: pendingUsers,
        },
        waitlist: {
          total: waitlistUsers,
          students: waitlistStudents,
          teachers: waitlistTeachers,
          admins: waitlistAdmins,
        },
        courses: {
          total: totalCourses,
          active: activeCourses,
        },
        departments: {
          total: totalDepartments,
        },
        certificates: {
          pending: pendingCertificates,
          approved: approvedCertificates,
        },
      },
    });
  } catch (error) {
    logger.error(`Error fetching super admin stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

/**
 * Create admin account (Super Admin only)
 */
const createAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check waitlist
    const existingWaitlist = await WaitlistUser.findOne({ email });
    if (existingWaitlist) {
      return res.status(400).json({
        success: false,
        message: 'User with this email is already in waitlist',
      });
    }

    // Create admin user directly (no waitlist)
    const admin = await User.create({
      email,
      password,
      role: ROLES.ADMIN,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });

    logger.info(`Admin created by super admin: ${admin.email}`, {
      createdBy: req.user.email,
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName,
      },
    });
  } catch (error) {
    logger.error(`Error creating admin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating admin account',
      error: error.message,
    });
  }
};

/**
 * Add admin to waitlist for approval
 */
const addAdminToWaitlist = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check waitlist
    const existingWaitlist = await WaitlistUser.findOne({ email });
    if (existingWaitlist) {
      return res.status(400).json({
        success: false,
        message: 'User with this email is already in waitlist',
      });
    }

    // Add to waitlist
    const waitlistAdmin = await WaitlistUser.create({
      email,
      password,
      role: 'admin',
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      status: 'pending',
    });

    logger.info(`Admin added to waitlist by super admin: ${waitlistAdmin.email}`);

    res.status(201).json({
      success: true,
      message: 'Admin added to waitlist successfully',
      data: {
        id: waitlistAdmin._id,
        email: waitlistAdmin.email,
        role: waitlistAdmin.role,
      },
    });
  } catch (error) {
    logger.error(`Error adding admin to waitlist: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error adding admin to waitlist',
      error: error.message,
    });
  }
};

/**
 * Get all pending admin approvals from waitlist
 */
const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await WaitlistUser.find({
      role: 'admin',
      status: 'pending',
    })
      .populate('department', 'name code')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingAdmins,
      count: pendingAdmins.length,
    });
  } catch (error) {
    logger.error(`Error fetching pending admins: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending admins',
      error: error.message,
    });
  }
};

/**
 * Approve admin from waitlist
 */
const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const waitlistUser = await WaitlistUser.findById(id).select('+password');
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    if (waitlistUser.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'This user is not an admin. Use regular approval process.',
      });
    }

    // Create user account
    const userData = {
      email: waitlistUser.email,
      password: waitlistUser.password,
      role: ROLES.ADMIN,
      firstName: waitlistUser.firstName,
      lastName: waitlistUser.lastName,
      phoneNumber: waitlistUser.phoneNumber,
      dateOfBirth: waitlistUser.dateOfBirth,
      gender: waitlistUser.gender,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    };

    // Create user without hashing password again (already hashed in waitlist)
    const user = new User(userData);
    user.isModified = () => false; // Prevent re-hashing
    await user.save({ validateBeforeSave: true });

    // Remove from waitlist
    await WaitlistUser.findByIdAndDelete(id);

    logger.info(`Admin approved by super admin: ${user.email}`, {
      approvedBy: req.user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Admin approved successfully',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    logger.error(`Error approving admin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving admin',
      error: error.message,
    });
  }
};

/**
 * Deny admin from waitlist
 */
const denyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const waitlistUser = await WaitlistUser.findById(id);
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    if (waitlistUser.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'This user is not an admin. Use regular denial process.',
      });
    }

    waitlistUser.status = 'denied';
    waitlistUser.deniedReason = reason || 'Admin approval denied by super admin';
    waitlistUser.deniedAt = new Date();
    await waitlistUser.save();

    logger.info(`Admin denied by super admin: ${waitlistUser.email}`, {
      deniedBy: req.user.email,
      reason,
    });

    res.status(200).json({
      success: true,
      message: 'Admin denied successfully',
    });
  } catch (error) {
    logger.error(`Error denying admin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error denying admin',
      error: error.message,
    });
  }
};

/**
 * Get admin details by ID
 */
const getAdminDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({ _id: id, role: ROLES.ADMIN })
      .select('-password')
      .populate('department', 'name code')
      .populate('verifiedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    logger.error(`Error fetching admin details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin details',
      error: error.message,
    });
  }
};

/**
 * Delete admin by ID
 */
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Delete admin request received for ID: ${id}`);

    // Find the admin first
    const admin = await User.findById(id);
    logger.info(`Admin lookup result: ${admin ? `Found ${admin.role}` : 'Not found'}`);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user is an admin
    if (admin.role !== ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with role: ${admin.role}. Use the appropriate endpoint.`,
      });
    }

    // Prevent self-deletion
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Delete the admin
    await User.findByIdAndDelete(id);
    logger.info(`Admin deleted successfully: ${admin.email}`);

    // Log activity
    await createActivityLog({
      action: 'ADMIN_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: admin._id,
      targetUserName: admin.fullName,
      description: `Deleted admin: ${admin.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting admin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting admin',
      error: error.message,
    });
  }
};

/**
 * Deactivate admin account
 */
const deactivateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({ _id: id, role: ROLES.ADMIN });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Prevent self-deactivation
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate your own account',
      });
    }

    admin.adminStatus = 'deactivated';
    admin.isActive = false;
    await admin.save();

    // Log activity
    await createActivityLog({
      action: 'ADMIN_DEACTIVATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: admin._id,
      targetUserName: admin.fullName,
      description: `Deactivated admin: ${admin.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Admin deactivated by super admin: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Admin deactivated successfully',
      data: admin,
    });
  } catch (error) {
    logger.error(`Error deactivating admin: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deactivating admin',
      error: error.message,
    });
  }
};

/**
 * Delete user (except super admins)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deletion of super admins
    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin accounts',
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(id);

    logger.info(`User deleted by super admin: ${user.email}`, {
      deletedBy: req.user.email,
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/**
 * Update user role (Super Admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent changing super admin role
    if (user.role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Cannot change super admin role',
      });
    }

    // Prevent promoting to super admin
    if (role === ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Cannot promote users to super admin',
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Log activity
    await createActivityLog({
      action: 'ROLE_CHANGED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: user._id,
      targetUserName: user.fullName,
      description: `Changed role from ${oldRole} to ${role}`,
      metadata: { oldRole, newRole: role },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`User role updated by super admin: ${user.email}`, {
      updatedBy: req.user.email,
      newRole: role,
    });

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error updating user role: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message,
    });
  }
};

// ==================== TEACHER MANAGEMENT ====================

/**
 * Get all teachers with filtering
 */
const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department, verified } = req.query;
    
    const query = { role: ROLES.FACULTY };
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const teachers = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .populate('verifiedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: teachers,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    logger.error(`Error fetching teachers: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message,
    });
  }
};

/**
 * Get pending teacher approvals
 */
const getPendingTeachers = async (req, res) => {
  try {
    const pendingTeachers = await WaitlistUser.find({
      role: 'teacher',
      status: 'pending',
    })
      .populate('department', 'name code')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingTeachers,
      count: pendingTeachers.length,
    });
  } catch (error) {
    logger.error(`Error fetching pending teachers: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending teachers',
      error: error.message,
    });
  }
};

/**
 * Approve teacher from waitlist
 */
const approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const waitlistUser = await WaitlistUser.findById(id).select('+password');
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    if (waitlistUser.role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'This user is not a teacher',
      });
    }

    // Create user account
    const user = new User({
      email: waitlistUser.email,
      password: waitlistUser.password,
      role: ROLES.FACULTY,
      firstName: waitlistUser.firstName,
      lastName: waitlistUser.lastName,
      phoneNumber: waitlistUser.phoneNumber,
      dateOfBirth: waitlistUser.dateOfBirth,
      gender: waitlistUser.gender,
      department: waitlistUser.department,
      designation: waitlistUser.designation,
      qualification: waitlistUser.qualification,
      joiningDate: waitlistUser.joiningDate,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });
    user.isModified = () => false;
    await user.save({ validateBeforeSave: true });

    // Remove from waitlist
    await WaitlistUser.findByIdAndDelete(id);

    // Log activity
    await createActivityLog({
      action: 'TEACHER_APPROVED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: user._id,
      targetUserName: user.fullName,
      description: `Approved teacher account: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Teacher approved by super admin: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Teacher approved successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Error approving teacher: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving teacher',
      error: error.message,
    });
  }
};

/**
 * Deny teacher from waitlist
 */
const denyTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const waitlistUser = await WaitlistUser.findById(id);
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    waitlistUser.status = 'denied';
    waitlistUser.deniedReason = reason || 'Teacher approval denied';
    waitlistUser.deniedAt = new Date();
    await waitlistUser.save();

    // Log activity
    await createActivityLog({
      action: 'TEACHER_DENIED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      description: `Denied teacher application: ${waitlistUser.email}`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Teacher denied by super admin: ${waitlistUser.email}`);

    res.status(200).json({
      success: true,
      message: 'Teacher denied successfully',
    });
  } catch (error) {
    logger.error(`Error denying teacher: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error denying teacher',
      error: error.message,
    });
  }
};

/**
 * Create teacher manually
 */
const createTeacher = async (req, res) => {
  try {
    console.log('📝 Received teacher data:', req.body);
    
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      employeeId,
      designation,
      joiningDate,
      qualification,
    } = req.body;

    console.log('✅ Extracted designation:', designation);

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Check for existing employee ID
    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: `Employee ID ${employeeId} is already in use. Please use a unique employee ID.`,
        });
      }
    }

    const teacher = await User.create({
      email,
      password,
      role: ROLES.FACULTY,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      employeeId,
      designation,
      joiningDate,
      qualification,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });

    // Log activity
    await createActivityLog({
      action: 'TEACHER_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: teacher._id,
      targetUserName: teacher.fullName,
      description: `Created teacher account: ${teacher.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Teacher created by super admin: ${teacher.email}`);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    });
  } catch (error) {
    logger.error(`Error creating teacher: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message,
    });
  }
};

/**
 * Update teacher details
 */
const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent role and sensitive field updates
    delete updates.role;
    delete updates.password;
    delete updates.isVerified;
    delete updates.verifiedBy;

    const teacher = await User.findOneAndUpdate(
      { _id: id, role: ROLES.FACULTY },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'USER_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: teacher._id,
      targetUserName: teacher.fullName,
      description: `Updated teacher details: ${teacher.email}`,
      metadata: { updates },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Teacher updated by super admin: ${teacher.email}`);

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher,
    });
  } catch (error) {
    logger.error(`Error updating teacher: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message,
    });
  }
};

/**
 * Delete teacher
 */
const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Delete teacher request received for ID: ${id}`);

    // Find the user first
    const teacher = await User.findById(id);
    logger.info(`Teacher lookup result: ${teacher ? `Found ${teacher.role}` : 'Not found'}`);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user is a teacher/faculty
    if (teacher.role !== ROLES.FACULTY && teacher.role !== ROLES.TEACHER) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with role: ${teacher.role}. Use the appropriate endpoint.`,
      });
    }

    // Delete the teacher
    await User.findByIdAndDelete(id);
    logger.info(`Teacher deleted successfully: ${teacher.email}`);

    // Log activity
    await createActivityLog({
      action: 'USER_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: teacher._id,
      targetUserName: teacher.fullName,
      description: `Deleted teacher: ${teacher.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting teacher: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message,
    });
  }
};

// ==================== STUDENT MANAGEMENT ====================

/**
 * Get all students with filtering
 */
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department, semester, verified } = req.query;
    
    const query = { role: ROLES.STUDENT };
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query)
      .select('-password')
      .populate('department', 'name code')
      .populate('verifiedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: students,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    logger.error(`Error fetching students: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message,
    });
  }
};

/**
 * Get student details by ID
 */
const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({ _id: id, role: ROLES.STUDENT })
      .select('-password')
      .populate('department', 'name code description')
      .populate('verifiedBy', 'firstName lastName email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    logger.error(`Error fetching student details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching student details',
      error: error.message,
    });
  }
};

/**
 * Get teacher details by ID
 */
const getTeacherDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await User.findOne({ _id: id, role: ROLES.FACULTY })
      .select('-password')
      .populate('department', 'name code description')
      .populate('verifiedBy', 'firstName lastName email');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    logger.error(`Error fetching teacher details: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher details',
      error: error.message,
    });
  }
};

/**
 * Get pending student approvals
 */
const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await WaitlistUser.find({
      role: 'student',
      status: 'pending',
    })
      .populate('department', 'name code')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingStudents,
      count: pendingStudents.length,
    });
  } catch (error) {
    logger.error(`Error fetching pending students: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending students',
      error: error.message,
    });
  }
};

/**
 * Approve student from waitlist
 */
const approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const waitlistUser = await WaitlistUser.findById(id).select('+password');
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    if (waitlistUser.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'This user is not a student',
      });
    }

    // Create user account
    const user = new User({
      email: waitlistUser.email,
      password: waitlistUser.password,
      role: ROLES.STUDENT,
      firstName: waitlistUser.firstName,
      lastName: waitlistUser.lastName,
      phoneNumber: waitlistUser.phoneNumber,
      dateOfBirth: waitlistUser.dateOfBirth,
      gender: waitlistUser.gender,
      department: waitlistUser.department,
      semester: waitlistUser.semester,
      admissionYear: waitlistUser.admissionYear,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });
    user.isModified = () => false;
    await user.save({ validateBeforeSave: true });

    // Remove from waitlist
    await WaitlistUser.findByIdAndDelete(id);

    // Log activity
    await createActivityLog({
      action: 'STUDENT_APPROVED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: user._id,
      targetUserName: user.fullName,
      description: `Approved student account: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Student approved by super admin: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Student approved successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Error approving student: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving student',
      error: error.message,
    });
  }
};

/**
 * Deny student from waitlist
 */
const denyStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const waitlistUser = await WaitlistUser.findById(id);
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }

    waitlistUser.status = 'denied';
    waitlistUser.deniedReason = reason || 'Student approval denied';
    waitlistUser.deniedAt = new Date();
    await waitlistUser.save();

    // Log activity
    await createActivityLog({
      action: 'STUDENT_DENIED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      description: `Denied student application: ${waitlistUser.email}`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Student denied by super admin: ${waitlistUser.email}`);

    res.status(200).json({
      success: true,
      message: 'Student denied successfully',
    });
  } catch (error) {
    logger.error(`Error denying student: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error denying student',
      error: error.message,
    });
  }
};

/**
 * Create student manually
 */
const createStudent = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      enrollmentNumber,
      semester,
      academicYear,
    } = req.body;

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Check for existing enrollment number
    if (enrollmentNumber) {
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: `Enrollment number ${enrollmentNumber} is already in use. Please use a unique enrollment number.`,
        });
      }
    }

    const student = await User.create({
      email,
      password,
      role: ROLES.STUDENT,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      enrollmentNumber,
      semester,
      admissionYear: academicYear,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
    });

    // Log activity
    await createActivityLog({
      action: 'STUDENT_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: student._id,
      targetUserName: student.fullName,
      description: `Created student account: ${student.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Student created by super admin: ${student.email}`);

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    logger.error(`Error creating student: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message,
    });
  }
};

/**
 * Update student details
 */
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent role and sensitive field updates
    delete updates.role;
    delete updates.password;
    delete updates.isVerified;
    delete updates.verifiedBy;

    const student = await User.findOneAndUpdate(
      { _id: id, role: ROLES.STUDENT },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'USER_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: student._id,
      targetUserName: student.fullName,
      description: `Updated student details: ${student.email}`,
      metadata: { updates },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Student updated by super admin: ${student.email}`);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    logger.error(`Error updating student: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message,
    });
  }
};

/**
 * Delete student
 */
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Delete student request received for ID: ${id}`);

    // Find the user first
    const student = await User.findById(id);
    logger.info(`Student lookup result: ${student ? `Found ${student.role}` : 'Not found'}`);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user is a student
    if (student.role !== ROLES.STUDENT) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user with role: ${student.role}. Use the appropriate endpoint.`,
      });
    }

    // Delete the student
    await User.findByIdAndDelete(id);
    logger.info(`Student deleted successfully: ${student.email}`);

    // Log activity
    await createActivityLog({
      action: 'USER_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetUser: student._id,
      targetUserName: student.fullName,
      description: `Deleted student: ${student.email}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting student: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message,
    });
  }
};

// ==================== COURSE MANAGEMENT ====================

/**
 * Get all courses
 */
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department, semester } = req.query;
    
    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('department', 'name code')
      .populate('faculty', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: courses,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    logger.error(`Error fetching courses: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

/**
 * Create course
 */
const createCourse = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      credits,
      department,
      semester,
      type,
      academicYear,
      faculty,
      isActive,
    } = req.body;

    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this code already exists',
      });
    }

    const course = await Course.create({
      name,
      code,
      description,
      credits,
      department,
      semester,
      type,
      academicYear,
      faculty,
      isActive: isActive !== undefined ? isActive : true,
    });

    // Log activity
    await createActivityLog({
      action: 'COURSE_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Course',
      targetId: course._id,
      description: `Created course: ${course.name} (${course.code})`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Course created by super admin: ${course.code}`);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    logger.error(`Error creating course: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
    });
  }
};

/**
 * Update course
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('department faculty');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'COURSE_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Course',
      targetId: course._id,
      description: `Updated course: ${course.name} (${course.code})`,
      metadata: { updates },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Course updated by super admin: ${course.code}`);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    logger.error(`Error updating course: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
};

/**
 * Delete course
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'COURSE_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Course',
      targetId: course._id,
      description: `Deleted course: ${course.name} (${course.code})`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Course deleted by super admin: ${course.code}`);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting course: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message,
    });
  }
};

/**
 * Assign teachers to course
 */
const assignTeachersToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { faculty } = req.body; // Array of teacher IDs

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    course.faculty = faculty;
    await course.save();

    const populatedCourse = await Course.findById(id)
      .populate('department', 'name code')
      .populate('faculty', 'firstName lastName email');

    // Log activity
    await createActivityLog({
      action: 'COURSE_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Course',
      targetId: course._id,
      description: `Assigned teachers to course: ${course.name}`,
      metadata: { faculty },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Teachers assigned to course by super admin: ${course.code}`);

    res.status(200).json({
      success: true,
      message: 'Teachers assigned successfully',
      data: populatedCourse,
    });
  } catch (error) {
    logger.error(`Error assigning teachers: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error assigning teachers',
      error: error.message,
    });
  }
};

// ==================== CERTIFICATE MANAGEMENT ====================

/**
 * Get all certificates with filtering
 */
const getAllCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, student } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (student) query.student = student;

    const certificates = await Certificate.find(query)
      .populate('student', 'firstName lastName email enrollmentNumber')
      .populate('course', 'name code')
      .populate('issuedBy', 'firstName lastName')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Certificate.countDocuments(query);

    res.status(200).json({
      success: true,
      data: certificates,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    logger.error(`Error fetching certificates: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificates',
      error: error.message,
    });
  }
};

/**
 * Approve certificate
 */
const approveCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    certificate.status = 'approved';
    certificate.approvedBy = req.user._id;
    certificate.approvedAt = new Date();
    await certificate.save();

    const populatedCert = await Certificate.findById(id)
      .populate('student', 'firstName lastName email')
      .populate('course', 'name code')
      .populate('approvedBy', 'firstName lastName');

    // Log activity
    await createActivityLog({
      action: 'CERTIFICATE_APPROVED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Certificate',
      targetId: certificate._id,
      description: `Approved certificate for ${populatedCert.student.firstName} ${populatedCert.student.lastName}`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Certificate approved by super admin: ${certificate._id}`);

    res.status(200).json({
      success: true,
      message: 'Certificate approved successfully',
      data: populatedCert,
    });
  } catch (error) {
    logger.error(`Error approving certificate: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving certificate',
      error: error.message,
    });
  }
};

/**
 * Reject certificate
 */
const rejectCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    certificate.status = 'rejected';
    certificate.rejectionReason = reason;
    certificate.rejectedAt = new Date();
    await certificate.save();

    // Log activity
    await createActivityLog({
      action: 'CERTIFICATE_REJECTED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Certificate',
      targetId: certificate._id,
      description: `Rejected certificate`,
      metadata: { reason },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Certificate rejected by super admin: ${certificate._id}`);

    res.status(200).json({
      success: true,
      message: 'Certificate rejected successfully',
    });
  } catch (error) {
    logger.error(`Error rejecting certificate: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error rejecting certificate',
      error: error.message,
    });
  }
};

// ==================== DEPARTMENT MANAGEMENT ====================

/**
 * Get all departments
 */
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: departments,
      count: departments.length,
    });
  } catch (error) {
    logger.error(`Error fetching departments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message,
    });
  }
};

/**
 * Create department
 */
const createDepartment = async (req, res) => {
  try {
    const { name, code, description, head } = req.body;

    const existingDept = await Department.findOne({ code });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department with this code already exists',
      });
    }

    const department = await Department.create({
      name,
      code,
      description,
      head,
    });

    // Log activity
    await createActivityLog({
      action: 'DEPARTMENT_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Department',
      targetId: department._id,
      description: `Created department: ${department.name} (${department.code})`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Department created by super admin: ${department.code}`);

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    logger.error(`Error creating department: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message,
    });
  }
};

/**
 * Update department
 */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const department = await Department.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName email');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'DEPARTMENT_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Department',
      targetId: department._id,
      description: `Updated department: ${department.name}`,
      metadata: { updates },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Department updated by super admin: ${department.code}`);

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    logger.error(`Error updating department: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message,
    });
  }
};

/**
 * Delete department
 */
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department has users
    const userCount = await User.countDocuments({ department: id });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department with ${userCount} associated users`,
      });
    }

    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Log activity
    await createActivityLog({
      action: 'DEPARTMENT_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.fullName,
      performedByRole: req.user.role,
      targetModel: 'Department',
      targetId: department._id,
      description: `Deleted department: ${department.name} (${department.code})`,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Department deleted by super admin: ${department.code}`);

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting department: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message,
    });
  }
};

// ==================== ACTIVITY LOGS ====================

/**
 * Get activity logs
 */
const getActivityLogsController = async (req, res) => {
  try {
    const { page, limit, action, performedBy, startDate, endDate } = req.query;
    
    const result = await getActivityLogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      action,
      performedBy,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error(`Error fetching activity logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: error.message,
    });
  }
};

/**
 * Get recent activities (for dashboard)
 */
const getRecentActivitiesController = async (req, res) => {
  try {
    const { limit } = req.query;
    const activities = await getRecentActivities(parseInt(limit) || 10);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    logger.error(`Error fetching recent activities: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message,
    });
  }
};

/**
 * Get pending admin registrations
 */
const getPendingAdminRegistrations = async (req, res) => {
  try {
    const pendingAdmins = await User.find({
      role: ROLES.ADMIN,
      adminStatus: 'pending',
    })
      .select('-password')
      .sort({ createdAt: -1 });

    logger.info(`Fetched ${pendingAdmins.length} pending admin registrations`);
    console.log('📋 Pending admin registrations:', pendingAdmins.map(a => ({ 
      id: a._id, 
      email: a.email, 
      name: `${a.firstName} ${a.lastName}`,
      status: a.adminStatus 
    })));

    res.status(200).json({
      success: true,
      data: pendingAdmins,
    });
  } catch (error) {
    logger.error(`Error fetching pending admin registrations: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending admin registrations',
      error: error.message,
    });
  }
};

/**
 * Approve admin registration
 */
const approveAdminRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: ROLES.ADMIN,
      adminStatus: 'pending',
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Pending admin registration not found',
      });
    }

    // Update admin status
    admin.adminStatus = 'approved';
    admin.approvedBy = req.user._id;
    admin.approvedAt = new Date();
    admin.isActive = true;
    admin.isVerified = true;
    admin.verifiedBy = req.user._id;
    admin.verifiedAt = new Date();
    await admin.save();

    // Log activity
    await createActivityLog({
      user: req.user._id,
      action: 'approve_admin_registration',
      resource: 'User',
      resourceId: admin._id,
      details: `Approved admin registration for ${admin.email}`,
    });

    logger.info(`Admin registration approved: ${admin.email} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Admin registration approved successfully',
      data: admin,
    });
  } catch (error) {
    logger.error(`Error approving admin registration: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving admin registration',
      error: error.message,
    });
  }
};

/**
 * Reject admin registration
 */
const rejectAdminRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await User.findOne({
      _id: id,
      role: ROLES.ADMIN,
      adminStatus: 'pending',
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Pending admin registration not found',
      });
    }

    // Delete the pending admin record
    await User.findByIdAndDelete(id);

    // Log activity
    await createActivityLog({
      user: req.user._id,
      action: 'reject_admin_registration',
      resource: 'User',
      resourceId: admin._id,
      details: `Rejected admin registration for ${admin.email}`,
    });

    logger.info(`Admin registration rejected: ${admin.email} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Admin registration rejected successfully',
    });
  } catch (error) {
    logger.error(`Error rejecting admin registration: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error rejecting admin registration',
      error: error.message,
    });
  }
};

module.exports = {
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
};
