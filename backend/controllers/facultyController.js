const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const StudyMaterial = require('../models/StudyMaterial');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { ENROLLMENT_STATUS, NOTIFICATION_TYPES } = require('../utils/constants');
const { getPagination, createPaginationResponse, calculateGrade, calculateGPA } = require('../utils/helpers');
const { deleteFile } = require('../services/fileService');
const { sendGradeNotificationEmail } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Get faculty dashboard
 * @route   GET /api/faculty/dashboard
 * @access  Private/Faculty
 */
const getDashboard = async (req, res) => {
  try {
    const facultyId = req.user._id;

    // Get assigned courses count
    const coursesCount = await Course.countDocuments({ faculty: facultyId, status: 'active' });

    // Get total students across all courses
    const courses = await Course.find({ faculty: facultyId }).select('_id');
    const courseIds = courses.map(c => c._id);
    
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds },
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    // Get recent activities
    const recentMaterials = await StudyMaterial.find({ uploadedBy: facultyId })
      .populate('course', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        coursesCount,
        totalStudents,
        recentMaterials,
      },
    });
  } catch (error) {
    logger.error(`Get faculty dashboard error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data.',
    });
  }
};

/**
 * @desc    Get assigned courses
 * @route   GET /api/faculty/courses
 * @access  Private/Faculty
 */
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id })
      .populate('department', 'name code')
      .populate('enrolledCount')
      .sort({ semester: 1 });

    res.status(200).json({
      success: true,
      data: { courses },
    });
  } catch (error) {
    logger.error(`Get my courses error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
    });
  }
};

/**
 * @desc    Get students enrolled in a course
 * @route   GET /api/faculty/courses/:courseId/students
 * @access  Private/Faculty
 */
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify faculty teaches this course
    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this course.',
      });
    }

    const enrollments = await Enrollment.find({
      course: courseId,
      status: ENROLLMENT_STATUS.ENROLLED,
    })
      .populate('student', 'firstName lastName email enrollmentNumber semester')
      .sort({ 'student.enrollmentNumber': 1 });

    res.status(200).json({
      success: true,
      data: { students: enrollments },
    });
  } catch (error) {
    logger.error(`Get course students error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching students.',
    });
  }
};

/**
 * @desc    Mark attendance
 * @route   POST /api/faculty/attendance/mark
 * @access  Private/Faculty
 */
const markAttendance = async (req, res) => {
  try {
    const { course, date, attendance } = req.body;

    // Verify faculty teaches this course
    const courseDoc = await Course.findOne({ _id: course, faculty: req.user._id });
    if (!courseDoc) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark attendance for this course.',
      });
    }

    // Check if attendance already marked for this date
    const existingAttendance = await Attendance.findOne({ course, date });
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this date.',
      });
    }

    // Create attendance records
    const attendanceRecords = attendance.map(a => ({
      course,
      student: a.student,
      date,
      status: a.status,
      markedBy: req.user._id,
      remarks: a.remarks,
      classType: req.body.classType || 'lecture',
    }));

    await Attendance.insertMany(attendanceRecords);

    logger.info(`Attendance marked by faculty ${req.user._id} for course ${course}`);

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully.',
    });
  } catch (error) {
    logger.error(`Mark attendance error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance.',
    });
  }
};

/**
 * @desc    Get attendance records for a course
 * @route   GET /api/faculty/courses/:courseId/attendance
 * @access  Private/Faculty
 */
const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, studentId } = req.query;

    // Verify faculty teaches this course
    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this course.',
      });
    }

    const query = { course: courseId };
    if (date) query.date = date;
    if (studentId) query.student = studentId;

    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'firstName lastName enrollmentNumber')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: { attendanceRecords },
    });
  } catch (error) {
    logger.error(`Get course attendance error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance.',
    });
  }
};

/**
 * @desc    Upload study material
 * @route   POST /api/faculty/study-materials/upload
 * @access  Private/Faculty
 */
const uploadStudyMaterial = async (req, res) => {
  try {
    const { title, description, course, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Verify faculty teaches this course
    const courseDoc = await Course.findOne({ _id: course, faculty: req.user._id });
    if (!courseDoc) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to upload materials for this course.',
      });
    }

    const material = await StudyMaterial.create({
      title,
      description,
      course,
      uploadedBy: req.user._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      category,
      tags: tags ? tags.split(',') : [],
    });

    // Create notification for students
    const enrollments = await Enrollment.find({
      course,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    const recipients = enrollments.map(e => ({ user: e.student }));

    await Notification.create({
      title: 'New Study Material',
      message: `New study material "${title}" has been uploaded for ${courseDoc.name}.`,
      type: NOTIFICATION_TYPES.COURSE_MATERIAL,
      sender: req.user._id,
      recipients,
      course,
    });

    logger.info(`Study material uploaded by faculty ${req.user._id} for course ${course}`);

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully.',
      data: { material },
    });
  } catch (error) {
    logger.error(`Upload study material error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error uploading study material.',
    });
  }
};

/**
 * @desc    Get uploaded study materials
 * @route   GET /api/faculty/study-materials
 * @access  Private/Faculty
 */
const getMyStudyMaterials = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);

    const materials = await StudyMaterial.find({ uploadedBy: req.user._id })
      .populate('course', 'name code')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await StudyMaterial.countDocuments({ uploadedBy: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        materials,
        pagination: createPaginationResponse(total, page, limit),
      },
    });
  } catch (error) {
    logger.error(`Get my study materials error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching study materials.',
    });
  }
};

/**
 * @desc    Delete study material
 * @route   DELETE /api/faculty/study-materials/:id
 * @access  Private/Faculty
 */
const deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findOne({
      _id: req.params.id,
      uploadedBy: req.user._id,
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Study material not found.',
      });
    }

    // Delete file from filesystem
    await deleteFile(material.fileUrl);

    await material.deleteOne();

    logger.info(`Study material deleted by faculty ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully.',
    });
  } catch (error) {
    logger.error(`Delete study material error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting study material.',
    });
  }
};

/**
 * @desc    Upload/Update grades
 * @route   POST /api/faculty/grades/upload
 * @access  Private/Faculty
 */
const uploadGrades = async (req, res) => {
  try {
    const { student, course, semester, academicYear, assessments, remarks } = req.body;

    // Verify faculty teaches this course
    const courseDoc = await Course.findOne({ _id: course, faculty: req.user._id });
    if (!courseDoc) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to upload grades for this course.',
      });
    }

    // Check if grade already exists
    let grade = await Grade.findOne({ student, course, semester, academicYear });

    if (grade) {
      // Update existing grade
      grade.assessments = assessments;
      grade.remarks = remarks;
      grade.uploadedBy = req.user._id;
      await grade.save();
    } else {
      // Create new grade
      grade = await Grade.create({
        student,
        course,
        semester,
        academicYear,
        assessments,
        remarks,
        uploadedBy: req.user._id,
      });
    }

    logger.info(`Grades uploaded by faculty ${req.user._id} for student ${student}`);

    res.status(200).json({
      success: true,
      message: 'Grades uploaded successfully.',
      data: { grade },
    });
  } catch (error) {
    logger.error(`Upload grades error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error uploading grades.',
    });
  }
};

/**
 * @desc    Publish grades (make visible to students)
 * @route   PUT /api/faculty/grades/:id/publish
 * @access  Private/Faculty
 */
const publishGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'email firstName')
      .populate('course', 'name');

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found.',
      });
    }

    // Verify faculty uploaded this grade
    if (grade.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to publish this grade.',
      });
    }

    grade.isPublished = true;
    grade.publishedDate = Date.now();
    await grade.save();

    // Send notification
    await Notification.create({
      title: 'Grade Published',
      message: `Your grade for ${grade.course.name} has been published.`,
      type: NOTIFICATION_TYPES.GRADE_UPDATE,
      sender: req.user._id,
      recipients: [{ user: grade.student._id }],
      course: grade.course._id,
    });

    // Send email
    await sendGradeNotificationEmail(grade.student, grade.course);

    logger.info(`Grade published by faculty ${req.user._id}`);

    res.status(200).json({
      success: true,
      message: 'Grade published successfully.',
      data: { grade },
    });
  } catch (error) {
    logger.error(`Publish grade error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error publishing grade.',
    });
  }
};

/**
 * @desc    Get grades for a course
 * @route   GET /api/faculty/courses/:courseId/grades
 * @access  Private/Faculty
 */
const getCourseGrades = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify faculty teaches this course
    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view grades for this course.',
      });
    }

    const grades = await Grade.find({ course: courseId })
      .populate('student', 'firstName lastName enrollmentNumber')
      .sort({ 'student.enrollmentNumber': 1 });

    res.status(200).json({
      success: true,
      data: { grades },
    });
  } catch (error) {
    logger.error(`Get course grades error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching grades.',
    });
  }
};

/**
 * @desc    Send announcement
 * @route   POST /api/faculty/announcements
 * @access  Private/Faculty
 */
const sendAnnouncement = async (req, res) => {
  try {
    const { title, message, courseId, priority } = req.body;

    // Get students enrolled in the course
    const enrollments = await Enrollment.find({
      course: courseId,
      status: ENROLLMENT_STATUS.ENROLLED,
    });

    const recipients = enrollments.map(e => ({ user: e.student }));

    const notification = await Notification.create({
      title,
      message,
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      sender: req.user._id,
      recipients,
      course: courseId,
      priority: priority || 'medium',
    });

    logger.info(`Announcement sent by faculty ${req.user._id} for course ${courseId}`);

    res.status(201).json({
      success: true,
      message: 'Announcement sent successfully.',
      data: { notification },
    });
  } catch (error) {
    logger.error(`Send announcement error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error sending announcement.',
    });
  }
};

module.exports = {
  getDashboard,
  getMyCourses,
  getCourseStudents,
  markAttendance,
  getCourseAttendance,
  uploadStudyMaterial,
  getMyStudyMaterials,
  deleteStudyMaterial,
  uploadGrades,
  publishGrade,
  getCourseGrades,
  sendAnnouncement,
};
