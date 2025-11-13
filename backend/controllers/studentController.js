const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const StudyMaterial = require('../models/StudyMaterial');
const Timetable = require('../models/Timetable');
const CertificateRequest = require('../models/CertificateRequest');
const Notification = require('../models/Notification');
const { ENROLLMENT_STATUS, CERTIFICATE_STATUS } = require('../utils/constants');
const { calculateAttendancePercentage, getPagination, createPaginationResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Get student dashboard data
 * @route   GET /api/students/dashboard
 * @access  Private/Student
 */
const getDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get enrolled courses count
    const enrolledCoursesCount = await Enrollment.countDocuments({
      student: studentId,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    // Get overall attendance
    const attendanceRecords = await Attendance.find({ student: studentId });
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const totalClasses = attendanceRecords.length;
    const overallAttendance = calculateAttendancePercentage(presentCount, totalClasses);

    // Get recent grades
    const recentGrades = await Grade.find({ student: studentId, isPublished: true })
      .populate('course', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate CGPA
    const allGrades = await Grade.find({ student: studentId, isPublished: true });
    const { calculateCGPA } = require('../utils/helpers');
    const cgpa = calculateCGPA(allGrades.map(g => ({ grade: g.grade, credits: 3 })));

    // Get unread notifications
    const unreadNotificationsCount = await Notification.countDocuments({
      'recipients.user': studentId,
      'recipients.isRead': false,
    });

    // Get pending certificate requests
    const pendingCertificatesCount = await CertificateRequest.countDocuments({
      student: studentId,
      status: CERTIFICATE_STATUS.PENDING,
    });

    res.status(200).json({
      success: true,
      data: {
        enrolledCoursesCount,
        overallAttendance: parseFloat(overallAttendance),
        cgpa: parseFloat(cgpa),
        recentGrades,
        unreadNotificationsCount,
        pendingCertificatesCount,
      },
    });
  } catch (error) {
    logger.error(`Get student dashboard error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data.',
    });
  }
};

/**
 * @desc    Get student profile
 * @route   GET /api/students/profile
 * @access  Private/Student
 */
const getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate('department', 'name code');

    res.status(200).json({
      success: true,
      data: { student },
    });
  } catch (error) {
    logger.error(`Get student profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
    });
  }
};

/**
 * @desc    Update student profile
 * @route   PUT /api/students/profile
 * @access  Private/Student
 */
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['phoneNumber', 'address', 'profilePicture'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { student },
    });
  } catch (error) {
    logger.error(`Update student profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating profile.',
    });
  }
};

/**
 * @desc    Get enrolled courses
 * @route   GET /api/students/courses
 * @access  Private/Student
 */
const getEnrolledCourses = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);

    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: ENROLLMENT_STATUS.ENROLLED,
    })
      .populate('course')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Enrollment.countDocuments({
      student: req.user._id,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    res.status(200).json({
      success: true,
      data: {
        enrollments,
        pagination: createPaginationResponse(total, page, limit),
      },
    });
  } catch (error) {
    logger.error(`Get enrolled courses error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses.',
    });
  }
};

/**
 * @desc    Register for a course
 * @route   POST /api/students/courses/register
 * @access  Private/Student
 */
const registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course.',
      });
    }

    // Check course capacity
    const enrolledCount = await Enrollment.countDocuments({
      course: courseId,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    if (enrolledCount >= course.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Course is full.',
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      semester: req.user.semester,
      academicYear: course.academicYear,
    });

    logger.info(`Student ${studentId} enrolled in course ${courseId}`);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course.',
      data: { enrollment },
    });
  } catch (error) {
    logger.error(`Course registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error registering for course.',
    });
  }
};

/**
 * @desc    Get attendance records
 * @route   GET /api/students/attendance
 * @access  Private/Student
 */
const getAttendance = async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = { student: req.user._id };

    if (courseId) {
      query.course = courseId;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('course', 'name code')
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 });

    // Calculate attendance percentage per course
    const attendanceByCourse = {};
    attendanceRecords.forEach(record => {
      const courseId = record.course._id.toString();
      if (!attendanceByCourse[courseId]) {
        attendanceByCourse[courseId] = {
          course: record.course,
          total: 0,
          present: 0,
          percentage: 0,
        };
      }
      attendanceByCourse[courseId].total++;
      if (record.status === 'present') {
        attendanceByCourse[courseId].present++;
      }
    });

    Object.keys(attendanceByCourse).forEach(courseId => {
      const data = attendanceByCourse[courseId];
      data.percentage = calculateAttendancePercentage(data.present, data.total);
    });

    res.status(200).json({
      success: true,
      data: {
        attendanceRecords,
        summary: Object.values(attendanceByCourse),
      },
    });
  } catch (error) {
    logger.error(`Get attendance error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance.',
    });
  }
};

/**
 * @desc    Get grades
 * @route   GET /api/students/grades
 * @access  Private/Student
 */
const getGrades = async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.user._id,
      isPublished: true,
    })
      .populate('course', 'name code credits')
      .sort({ semester: 1 });

    // Calculate CGPA
    const { calculateCGPA } = require('../utils/helpers');
    const cgpa = calculateCGPA(grades.map(g => ({ grade: g.grade, credits: g.course.credits || 3 })));

    res.status(200).json({
      success: true,
      data: {
        grades,
        cgpa: parseFloat(cgpa),
      },
    });
  } catch (error) {
    logger.error(`Get grades error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching grades.',
    });
  }
};

/**
 * @desc    Get timetable
 * @route   GET /api/students/timetable
 * @access  Private/Student
 */
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({
      department: req.user.department,
      semester: req.user.semester,
      isActive: true,
    })
      .populate('schedule.slots.course', 'name code')
      .populate('schedule.slots.faculty', 'firstName lastName');

    res.status(200).json({
      success: true,
      data: { timetable },
    });
  } catch (error) {
    logger.error(`Get timetable error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching timetable.',
    });
  }
};

/**
 * @desc    Get study materials
 * @route   GET /api/students/study-materials
 * @access  Private/Student
 */
const getStudyMaterials = async (req, res) => {
  try {
    const { courseId, category } = req.query;
    const { page, limit } = getPagination(req.query.page, req.query.limit);

    // Get student's enrolled courses
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: ENROLLMENT_STATUS.ENROLLED,
    }).select('course');

    const courseIds = enrollments.map(e => e.course);

    const query = {
      course: { $in: courseIds },
      isActive: true,
    };

    if (courseId) {
      query.course = courseId;
    }

    if (category) {
      query.category = category;
    }

    const materials = await StudyMaterial.find(query)
      .populate('course', 'name code')
      .populate('uploadedBy', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await StudyMaterial.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        materials,
        pagination: createPaginationResponse(total, page, limit),
      },
    });
  } catch (error) {
    logger.error(`Get study materials error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching study materials.',
    });
  }
};

/**
 * @desc    Request certificate
 * @route   POST /api/students/certificates/request
 * @access  Private/Student
 */
const requestCertificate = async (req, res) => {
  try {
    const { certificateType, purpose } = req.body;

    const certificateRequest = await CertificateRequest.create({
      student: req.user._id,
      certificateType,
      purpose,
    });

    logger.info(`Certificate requested by student ${req.user._id}: ${certificateType}`);

    res.status(201).json({
      success: true,
      message: 'Certificate request submitted successfully.',
      data: { certificateRequest },
    });
  } catch (error) {
    logger.error(`Request certificate error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error submitting certificate request.',
    });
  }
};

/**
 * @desc    Get certificate requests
 * @route   GET /api/students/certificates
 * @access  Private/Student
 */
const getCertificateRequests = async (req, res) => {
  try {
    const requests = await CertificateRequest.find({ student: req.user._id })
      .populate('approvedBy', 'firstName lastName')
      .sort({ requestDate: -1 });

    res.status(200).json({
      success: true,
      data: { requests },
    });
  } catch (error) {
    logger.error(`Get certificate requests error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching certificate requests.',
    });
  }
};

/**
 * @desc    Get notifications
 * @route   GET /api/students/notifications
 * @access  Private/Student
 */
const getNotifications = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);

    const notifications = await Notification.find({
      'recipients.user': req.user._id,
      isActive: true,
    })
      .populate('sender', 'firstName lastName role')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments({
      'recipients.user': req.user._id,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: createPaginationResponse(total, page, limit),
      },
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications.',
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/students/notifications/:id/read
 * @access  Private/Student
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        'recipients.user': req.user._id,
      },
      {
        $set: {
          'recipients.$.isRead': true,
          'recipients.$.readAt': Date.now(),
        },
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: { notification },
    });
  } catch (error) {
    logger.error(`Mark notification as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read.',
    });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getEnrolledCourses,
  registerCourse,
  getAttendance,
  getGrades,
  getTimetable,
  getStudyMaterials,
  requestCertificate,
  getCertificateRequests,
  getNotifications,
  markNotificationAsRead,
};
