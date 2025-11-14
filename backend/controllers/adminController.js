const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Timetable = require('../models/Timetable');
const CertificateRequest = require('../models/CertificateRequest');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const { ROLES, CERTIFICATE_STATUS, ENROLLMENT_STATUS } = require('../utils/constants');
const { getPagination, createPaginationResponse, generateEnrollmentNumber, generateEmployeeID } = require('../utils/helpers');
const { sendCertificateApprovalEmail } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
const getDashboard = async (req, res) => {
  try {
    // Get counts
    const totalStudents = await User.countDocuments({ role: ROLES.STUDENT, isActive: true });
    const totalFaculty = await User.countDocuments({ role: ROLES.FACULTY, isActive: true });
    const totalDepartments = await Department.countDocuments({ isActive: true });
    const totalCourses = await Course.countDocuments({ status: 'active' });
    const pendingCertificates = await CertificateRequest.countDocuments({ status: CERTIFICATE_STATUS.PENDING });

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'firstName lastName enrollmentNumber')
      .populate('course', 'name code')
      .sort({ createdAt: -1 })
      .limit(10);

    // Department-wise student count
    const departmentStats = await User.aggregate([
      { $match: { role: ROLES.STUDENT, isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
      { $unwind: '$department' },
      { $project: { departmentName: '$department.name', count: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        totalCourses,
        pendingCertificates,
        recentEnrollments,
        departmentStats,
      },
    });
  } catch (error) {
    logger.error(`Get admin dashboard error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data.',
    });
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/admin/students
 * @access  Private/Admin
 */
const getStudents = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);
    const { department, semester, search } = req.query;

    const query = { role: ROLES.STUDENT };
    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query)
      .populate('department', 'name code')
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: students,
      pagination: createPaginationResponse(total, page, limit),
    });
  } catch (error) {
    logger.error(`Get students error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching students.',
    });
  }
};

/**
 * @desc    Add new student
 * @route   POST /api/admin/students
 * @access  Private/Admin
 */
const addStudent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, dateOfBirth, gender, department, semester, admissionYear, enrollmentNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Check for duplicate enrollment number if provided
    if (enrollmentNumber) {
      const existingEnrollment = await User.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: `Enrollment number ${enrollmentNumber} is already in use. Please use a unique enrollment number.`,
        });
      }
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
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
      semester,
      admissionYear,
      enrollmentNumber: enrollmentNumber || generateEnrollmentNumber(dept.code, admissionYear),
      batch: `${admissionYear}-${parseInt(admissionYear) + 4}`,
    });

    logger.info(`Student added by admin: ${student.email}`);

    res.status(201).json({
      success: true,
      message: 'Student added successfully.',
      data: { student },
    });
  } catch (error) {
    logger.error(`Add student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error adding student.',
    });
  }
};

/**
 * @desc    Update student
 * @route   PUT /api/admin/students/:id
 * @access  Private/Admin
 */
const updateStudent = async (req, res) => {
  try {
    const { enrollmentNumber } = req.body;

    // Check for duplicate enrollment number if it's being updated
    if (enrollmentNumber) {
      const existingEnrollment = await User.findOne({ 
        enrollmentNumber,
        _id: { $ne: req.params.id }
      });
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: `Enrollment number ${enrollmentNumber} is already in use. Please use a unique enrollment number.`,
        });
      }
    }

    // Prepare update data - filter out empty password
    const updateData = { ...req.body };
    if (!updateData.password || updateData.password.trim() === '') {
      delete updateData.password;
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.STUDENT },
      updateData,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    logger.info(`Student updated by admin: ${student._id}`);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      data: { student },
    });
  } catch (error) {
    logger.error(`Update student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating student.',
    });
  }
};

/**
 * @desc    Delete/Deactivate student
 * @route   DELETE /api/admin/students/:id
 * @access  Private/Admin
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.STUDENT },
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    logger.info(`Student deactivated by admin: ${student._id}`);

    res.status(200).json({
      success: true,
      message: 'Student deactivated successfully.',
    });
  } catch (error) {
    logger.error(`Delete student error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting student.',
    });
  }
};

/**
 * @desc    Get all faculty
 * @route   GET /api/admin/faculty
 * @access  Private/Admin
 */
const getFaculty = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);
    const { department, search } = req.query;

    const query = { role: ROLES.FACULTY };
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const faculty = await User.find(query)
      .populate('department', 'name code')
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: faculty,
      pagination: createPaginationResponse(total, page, limit),
    });
  } catch (error) {
    logger.error(`Get faculty error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty.',
    });
  }
};

/**
 * @desc    Add new faculty
 * @route   POST /api/admin/faculty
 * @access  Private/Admin
 */
const addFaculty = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, dateOfBirth, gender, department, designation, qualification, joiningDate, employeeId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    // Check for duplicate employee ID if provided
    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: `Employee ID ${employeeId} is already in use. Please use a unique employee ID.`,
        });
      }
    }

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    const faculty = await User.create({
      email,
      password,
      role: ROLES.FACULTY,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      department,
      designation,
      qualification,
      joiningDate,
      employeeId: employeeId || generateEmployeeID(dept.code),
    });

    logger.info(`Faculty added by admin: ${faculty.email}`);

    res.status(201).json({
      success: true,
      message: 'Faculty added successfully.',
      data: { faculty },
    });
  } catch (error) {
    logger.error(`Add faculty error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error adding faculty.',
    });
  }
};

/**
 * @desc    Update faculty
 * @route   PUT /api/admin/faculty/:id
 * @access  Private/Admin
 */
const updateFaculty = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // Check for duplicate employee ID if it's being updated
    if (employeeId) {
      const existingEmployee = await User.findOne({ 
        employeeId,
        _id: { $ne: req.params.id }
      });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: `Employee ID ${employeeId} is already in use. Please use a unique employee ID.`,
        });
      }
    }

    // Prepare update data - filter out empty password
    const updateData = { ...req.body };
    if (!updateData.password || updateData.password.trim() === '') {
      delete updateData.password;
    }

    const faculty = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.FACULTY },
      updateData,
      { new: true, runValidators: true }
    ).populate('department', 'name code');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found.',
      });
    }

    logger.info(`Faculty updated by admin: ${faculty._id}`);

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully.',
      data: { faculty },
    });
  } catch (error) {
    logger.error(`Update faculty error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating faculty.',
    });
  }
};

/**
 * @desc    Delete/Deactivate faculty
 * @route   DELETE /api/admin/faculty/:id
 * @access  Private/Admin
 */
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await User.findOneAndUpdate(
      { _id: req.params.id, role: ROLES.FACULTY },
      { isActive: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found.',
      });
    }

    logger.info(`Faculty deactivated by admin: ${faculty._id}`);

    res.status(200).json({
      success: true,
      message: 'Faculty deactivated successfully.',
    });
  } catch (error) {
    logger.error(`Delete faculty error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting faculty.',
    });
  }
};

/**
 * @desc    Assign faculty to course
 * @route   PUT /api/admin/courses/:courseId/assign-faculty
 * @access  Private/Admin
 */
const assignFacultyToCourse = async (req, res) => {
  try {
    const { facultyId } = req.body;

    const faculty = await User.findOne({ _id: facultyId, role: ROLES.FACULTY });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found.',
      });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { faculty: facultyId },
      { new: true }
    ).populate('faculty', 'firstName lastName employeeId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    logger.info(`Faculty ${facultyId} assigned to course ${course._id} by admin`);

    res.status(200).json({
      success: true,
      message: 'Faculty assigned to course successfully.',
      data: { course },
    });
  } catch (error) {
    logger.error(`Assign faculty to course error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error assigning faculty to course.',
    });
  }
};

/**
 * @desc    Get all departments
 * @route   GET /api/admin/departments
 * @access  Private/Admin
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('head', 'firstName lastName')
      .populate('studentsCount')
      .populate('facultyCount')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    logger.error(`Get departments error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments.',
    });
  }
};

/**
 * @desc    Create department
 * @route   POST /api/admin/departments
 * @access  Private/Admin
 */
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    logger.info(`Department created by admin: ${department.name}`);

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      data: { department },
    });
  } catch (error) {
    logger.error(`Create department error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating department.',
    });
  }
};

/**
 * @desc    Update department
 * @route   PUT /api/admin/departments/:id
 * @access  Private/Admin
 */
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    logger.info(`Department updated by admin: ${department._id}`);

    res.status(200).json({
      success: true,
      message: 'Department updated successfully.',
      data: { department },
    });
  } catch (error) {
    logger.error(`Update department error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating department.',
    });
  }
};

/**
 * @desc    Get all courses
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
const getCourses = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query.page, req.query.limit);
    const { department, semester } = req.query;

    const query = {};
    if (department) query.department = department;
    if (semester) query.semester = semester;

    const courses = await Course.find(query)
      .populate('department', 'name code')
      .populate('faculty', 'firstName lastName')
      .populate('enrolledCount')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ code: 1 });

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: courses,
      pagination: createPaginationResponse(total, page, limit),
    });
  } catch (error) {
    logger.error(`Get courses error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses.',
    });
  }
};

/**
 * @desc    Create course
 * @route   POST /api/admin/courses
 * @access  Private/Admin
 */
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    logger.info(`Course created by admin: ${course.code}`);

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: { course },
    });
  } catch (error) {
    logger.error(`Create course error: ${error.message}`);
    console.error('Create course error details:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating course.',
      error: error.message,
    });
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/admin/courses/:id
 * @access  Private/Admin
 */
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name code').populate('faculty', 'firstName lastName');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    logger.info(`Course updated by admin: ${course._id}`);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      data: { course },
    });
  } catch (error) {
    logger.error(`Update course error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating course.',
    });
  }
};

/**
 * @desc    Delete/Deactivate course
 * @route   DELETE /api/admin/courses/:id
 * @access  Private/Admin
 */
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    logger.info(`Course deactivated by admin: ${course._id}`);

    res.status(200).json({
      success: true,
      message: 'Course deactivated successfully.',
    });
  } catch (error) {
    logger.error(`Delete course error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting course.',
    });
  }
};

/**
 * @desc    Delete/Deactivate department
 * @route   DELETE /api/admin/departments/:id
 * @access  Private/Admin
 */
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found.',
      });
    }

    logger.info(`Department deactivated by admin: ${department._id}`);

    res.status(200).json({
      success: true,
      message: 'Department deactivated successfully.',
    });
  } catch (error) {
    logger.error(`Delete department error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting department.',
    });
  }
};

/**
 * @desc    Create/Update timetable
 * @route   POST /api/admin/timetables
 * @access  Private/Admin
 */
const manageTimetable = async (req, res) => {
  try {
    const { department, semester, academicYear, schedule } = req.body;

    let timetable = await Timetable.findOne({ department, semester, academicYear });

    if (timetable) {
      timetable.schedule = schedule;
      await timetable.save();
    } else {
      timetable = await Timetable.create({ department, semester, academicYear, schedule });
    }

    logger.info(`Timetable managed by admin for dept ${department}, semester ${semester}`);

    res.status(200).json({
      success: true,
      message: 'Timetable saved successfully.',
      data: { timetable },
    });
  } catch (error) {
    logger.error(`Manage timetable error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error managing timetable.',
    });
  }
};

/**
 * @desc    Get certificate requests
 * @route   GET /api/admin/certificates
 * @access  Private/Admin
 */
const getCertificateRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const { page, limit } = getPagination(req.query.page, req.query.limit);

    const query = {};
    if (status) query.status = status;

    const requests = await CertificateRequest.find(query)
      .populate('student', 'firstName lastName enrollmentNumber email')
      .populate('approvedBy', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ requestDate: -1 });

    const total = await CertificateRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: createPaginationResponse(total, page, limit),
      },
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
 * @desc    Approve certificate request
 * @route   PUT /api/admin/certificates/:id/approve
 * @access  Private/Admin
 */
const approveCertificate = async (req, res) => {
  try {
    const { certificateNumber, validUntil, remarks } = req.body;

    const request = await CertificateRequest.findById(req.params.id)
      .populate('student', 'email firstName');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Certificate request not found.',
      });
    }

    request.status = CERTIFICATE_STATUS.APPROVED;
    request.approvedBy = req.user._id;
    request.approvedDate = Date.now();
    request.certificateNumber = certificateNumber;
    request.issueDate = Date.now();
    request.validUntil = validUntil;
    request.remarks = remarks;
    await request.save();

    // Send notification and email
    await sendCertificateApprovalEmail(request.student, request.certificateType);

    logger.info(`Certificate approved by admin: ${request._id}`);

    res.status(200).json({
      success: true,
      message: 'Certificate approved successfully.',
      data: { request },
    });
  } catch (error) {
    logger.error(`Approve certificate error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error approving certificate.',
    });
  }
};

/**
 * @desc    Reject certificate request
 * @route   PUT /api/admin/certificates/:id/reject
 * @access  Private/Admin
 */
const rejectCertificate = async (req, res) => {
  try {
    const { rejectedReason } = req.body;

    const request = await CertificateRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Certificate request not found.',
      });
    }

    request.status = CERTIFICATE_STATUS.REJECTED;
    request.approvedBy = req.user._id;
    request.approvedDate = Date.now();
    request.rejectedReason = rejectedReason;
    await request.save();

    logger.info(`Certificate rejected by admin: ${request._id}`);

    res.status(200).json({
      success: true,
      message: 'Certificate request rejected.',
      data: { request },
    });
  } catch (error) {
    logger.error(`Reject certificate error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error rejecting certificate.',
    });
  }
};

module.exports = {
  getDashboard,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  assignFacultyToCourse,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  manageTimetable,
  getCertificateRequests,
  approveCertificate,
  rejectCertificate,
};
