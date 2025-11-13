const WaitlistUser = require('../models/WaitlistUser');
const User = require('../models/User');
const Department = require('../models/Department');
const { generateEnrollmentNumber, generateEmployeeID } = require('../utils/helpers');
const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * @desc    Get all waitlist users (pending approval)
 * @route   GET /api/admin/waitlist
 * @access  Private/Admin
 */
const getWaitlistUsers = async (req, res) => {
  try {
    const { status, role, page = 1, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    
    const skip = (page - 1) * limit;
    
    const users = await WaitlistUser.find(query)
      .populate('department', 'name code')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await WaitlistUser.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error(`Error fetching waitlist users: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching waitlist users',
    });
  }
};

/**
 * @desc    Get waitlist statistics
 * @route   GET /api/admin/waitlist/stats
 * @access  Private/Admin
 */
const getWaitlistStats = async (req, res) => {
  try {
    const { userRole } = req;  // Get the role of the requesting user
    
    let stats = {};
    
    // Super Admin and Admin can see all stats
    if (userRole === ROLES.SUPER_ADMIN || userRole === ROLES.ADMIN) {
      const pendingStudents = await WaitlistUser.countDocuments({ role: 'student', status: 'pending' });
      const pendingTeachers = await WaitlistUser.countDocuments({ role: 'teacher', status: 'pending' });
      const pendingFaculty = await WaitlistUser.countDocuments({ role: 'faculty', status: 'pending' });
      const pendingAdmins = await WaitlistUser.countDocuments({ role: 'admin', status: 'pending' });
      
      const deniedStudents = await WaitlistUser.countDocuments({ role: 'student', status: 'denied' });
      const deniedTeachers = await WaitlistUser.countDocuments({ role: 'teacher', status: 'denied' });
      const deniedFaculty = await WaitlistUser.countDocuments({ role: 'faculty', status: 'denied' });
      const deniedAdmins = await WaitlistUser.countDocuments({ role: 'admin', status: 'denied' });
      
      stats = {
        pending: {
          students: pendingStudents,
          teachers: pendingTeachers,
          faculty: pendingFaculty,
          admins: userRole === ROLES.SUPER_ADMIN ? pendingAdmins : 0, // Only super admin sees pending admins
          total: pendingStudents + pendingTeachers + pendingFaculty + (userRole === ROLES.SUPER_ADMIN ? pendingAdmins : 0),
        },
        denied: {
          students: deniedStudents,
          teachers: deniedTeachers,
          faculty: deniedFaculty,
          admins: userRole === ROLES.SUPER_ADMIN ? deniedAdmins : 0,
          total: deniedStudents + deniedTeachers + deniedFaculty + (userRole === ROLES.SUPER_ADMIN ? deniedAdmins : 0),
        },
      };
    }
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error(`Error fetching waitlist stats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
    });
  }
};

/**
 * @desc    Approve waitlist user
 * @route   POST /api/admin/waitlist/:id/approve
 * @access  Private/Admin
 */
const approveWaitlistUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find waitlist user
    const waitlistUser = await WaitlistUser.findById(id).select('+password');
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }
    
    if (waitlistUser.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User is not in pending status',
      });
    }
    
    // Check if email already exists in verified users
    const existingUser = await User.findOne({ email: waitlistUser.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
    
    // Get department for generating ID
    const department = await Department.findById(waitlistUser.department);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }
    
    // Create verified user object
    const userData = {
      email: waitlistUser.email,
      password: waitlistUser.password, // Already hashed in waitlist
      role: waitlistUser.role,
      firstName: waitlistUser.firstName,
      lastName: waitlistUser.lastName,
      phoneNumber: waitlistUser.phoneNumber,
      dateOfBirth: waitlistUser.dateOfBirth,
      gender: waitlistUser.gender,
      department: waitlistUser.department,
      isActive: true,
      isVerified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      isEmailVerified: true,
    };
    
    // Add role-specific fields
    if (waitlistUser.role === ROLES.STUDENT || waitlistUser.role === 'student') {
      userData.semester = waitlistUser.semester;
      userData.admissionYear = waitlistUser.admissionYear;
      userData.enrollmentNumber = generateEnrollmentNumber(department.code, waitlistUser.admissionYear);
      userData.batch = `${waitlistUser.admissionYear}-${parseInt(waitlistUser.admissionYear) + 4}`;
    } else if (waitlistUser.role === ROLES.FACULTY || waitlistUser.role === ROLES.TEACHER || waitlistUser.role === 'faculty' || waitlistUser.role === 'teacher') {
      userData.designation = waitlistUser.designation;
      userData.qualification = waitlistUser.qualification;
      userData.joiningDate = waitlistUser.joiningDate;
      userData.employeeId = generateEmployeeID(department.code);
      // Map teacher role to TEACHER constant
      if (waitlistUser.role === 'teacher') {
        userData.role = ROLES.TEACHER;
      }
    } else if (waitlistUser.role === 'admin') {
      // Admins can only be approved by super_admin
      // Regular admins should not be able to approve admin accounts
      return res.status(403).json({
        success: false,
        message: 'Only Super Admin can approve admin accounts',
      });
    }
    
    // Create verified user (skip hashing as password is already hashed)
    const user = new User(userData);
    await user.save({ validateBeforeSave: true });
    
    // Delete from waitlist
    await WaitlistUser.findByIdAndDelete(id);
    
    logger.info(`User approved and moved to verified: ${user.email} (${user.role}) by admin ${req.user.email}`);
    
    // TODO: Send approval email notification
    
    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          enrollmentNumber: user.enrollmentNumber,
          employeeId: user.employeeId,
        },
      },
    });
  } catch (error) {
    logger.error(`Error approving waitlist user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Deny waitlist user
 * @route   POST /api/admin/waitlist/:id/deny
 * @access  Private/Admin
 */
const denyWaitlistUser = async (req, res) => {
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
    
    if (waitlistUser.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User is not in pending status',
      });
    }
    
    // Update status to denied
    waitlistUser.status = 'denied';
    waitlistUser.deniedReason = reason || 'Application denied by administrator';
    waitlistUser.deniedAt = new Date();
    await waitlistUser.save();
    
    logger.info(`User denied: ${waitlistUser.email} (${waitlistUser.role}) by admin ${req.user.email}`);
    
    // TODO: Send denial email notification
    
    res.status(200).json({
      success: true,
      message: 'User application denied',
    });
  } catch (error) {
    logger.error(`Error denying waitlist user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error denying user',
    });
  }
};

/**
 * @desc    Delete waitlist user permanently
 * @route   DELETE /api/admin/waitlist/:id
 * @access  Private/Admin
 */
const deleteWaitlistUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const waitlistUser = await WaitlistUser.findByIdAndDelete(id);
    
    if (!waitlistUser) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist user not found',
      });
    }
    
    logger.info(`Waitlist user deleted: ${waitlistUser.email} by admin ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Waitlist user deleted successfully',
    });
  } catch (error) {
    logger.error(`Error deleting waitlist user: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
};

module.exports = {
  getWaitlistUsers,
  getWaitlistStats,
  approveWaitlistUser,
  denyWaitlistUser,
  deleteWaitlistUser,
};
