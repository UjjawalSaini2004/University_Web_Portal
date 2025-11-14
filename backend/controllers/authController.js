const User = require('../models/User');
const WaitlistUser = require('../models/WaitlistUser');
const { generateToken, generateRefreshToken } = require('../services/tokenService');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const { generateEnrollmentNumber, generateEmployeeID } = require('../utils/helpers');
const { ROLES } = require('../utils/constants');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * @desc    Register admin (pending approval)
 * @route   POST /api/auth/register-admin
 * @access  Public
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];

    // Create admin user with pending status
    const adminUser = await User.create({
      email,
      password,
      role: ROLES.ADMIN,
      firstName,
      lastName,
      phoneNumber: '0000000000', // Placeholder
      dateOfBirth: new Date('2000-01-01'), // Placeholder
      gender: 'other',
      adminStatus: 'pending',
      isActive: false, // Inactive until approved
      isVerified: false,
    });

    logger.info(`New admin registration pending approval: ${adminUser.email}`);

    res.status(201).json({
      success: true,
      message: 'Your admin request has been submitted. Please wait for Super Admin approval.',
      data: {
        email: adminUser.email,
        name: adminUser.fullName,
        status: 'pending',
      },
    });
  } catch (error) {
    logger.error(`Admin registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error during admin registration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Register new user (add to waitlist for approval)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phoneNumber, dateOfBirth, gender, department, semester, admissionYear, designation, qualification, joiningDate } = req.body;

    // Check if user already exists in verified users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Check if user already in waitlist
    const existingWaitlistUser = await WaitlistUser.findOne({ email });
    if (existingWaitlistUser) {
      if (existingWaitlistUser.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Your application is already submitted and pending approval.',
        });
      } else if (existingWaitlistUser.status === 'denied') {
        return res.status(400).json({
          success: false,
          message: 'Your previous application was denied. Please contact administrator.',
        });
      }
    }

    // Only allow student and teacher registration (not admin or super_admin)
    if (role !== ROLES.STUDENT && role !== ROLES.TEACHER && role !== ROLES.FACULTY) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Only students and teachers can register through signup.',
      });
    }

    // Create waitlist user object
    const waitlistData = {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      status: 'pending',
      submittedAt: new Date(),
    };

    // Add role-specific fields
    if (role === ROLES.STUDENT) {
      if (!semester || !admissionYear) {
        return res.status(400).json({
          success: false,
          message: 'Semester and admission year are required for students.',
        });
      }

      const Department = require('../models/Department');
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found.',
        });
      }

      waitlistData.semester = semester;
      waitlistData.admissionYear = admissionYear;
    } else if (role === ROLES.FACULTY || role === ROLES.TEACHER) {
      if (!designation || !qualification || !joiningDate) {
        return res.status(400).json({
          success: false,
          message: 'Designation, qualification, and joining date are required for teachers.',
        });
      }

      const Department = require('../models/Department');
      const dept = await Department.findById(department);
      if (!dept) {
        return res.status(404).json({
          success: false,
          message: 'Department not found.',
        });
      }

      waitlistData.designation = designation;
      waitlistData.qualification = qualification;
      waitlistData.joiningDate = joiningDate;
    }

    // Create waitlist user
    const waitlistUser = await WaitlistUser.create(waitlistData);

    logger.info(`New user added to waitlist: ${waitlistUser.email} (${waitlistUser.role})`);

    res.status(201).json({
      success: true,
      message: 'Your account has been submitted for approval. Please wait for admin verification. You will be able to login once approved.',
      data: {
        email: waitlistUser.email,
        role: waitlistUser.role,
        fullName: waitlistUser.fullName,
        status: 'pending',
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error during registration.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in verified users
    const user = await User.findOne({ email }).select('+password').populate('department', 'name code');

    if (!user) {
      // Check if user is in waitlist
      const waitlistUser = await WaitlistUser.findOne({ email });
      
      if (waitlistUser) {
        if (waitlistUser.status === 'pending') {
          return res.status(403).json({
            success: false,
            message: 'Your account is not approved yet. Please wait for admin verification.',
          });
        } else if (waitlistUser.status === 'denied') {
          return res.status(403).json({
            success: false,
            message: 'Your account application was denied. Please contact administrator.',
          });
        }
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Check if account is verified (super_admin bypasses this check)
    if (!user.isVerified && user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified. Please wait for admin approval.',
      });
    }

    // Check admin approval status (only for newly registered admins)
    if (user.role === ROLES.ADMIN && user.adminStatus) {
      if (user.adminStatus === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your admin account is awaiting Super Admin approval.',
        });
      }
      if (user.adminStatus === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your admin registration request was rejected.',
        });
      }
      if (user.adminStatus === 'deactivated') {
        return res.status(403).json({
          success: false,
          message: 'Your admin account has been deactivated. Please contact Super Admin.',
        });
      }
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          department: user.department,
          enrollmentNumber: user.enrollmentNumber,
          employeeId: user.employeeId,
          semester: user.semester,
          isEmailVerified: user.isEmailVerified,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error during login.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('department', 'name code');

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    logger.error(`Get me error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile.',
    });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email.',
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    logger.info(`Password reset requested for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email.',
    });
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.',
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error resetting password.',
    });
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token.',
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error verifying email.',
    });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    logger.info(`Password updated for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating password.',
    });
  }
};

module.exports = {
  register,
  registerAdmin,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updatePassword,
};
