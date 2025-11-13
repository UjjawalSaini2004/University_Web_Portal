const mongoose = require('mongoose');
const { ENROLLMENT_STATUS } = require('../utils/constants');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8,
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: Object.values(ENROLLMENT_STATUS),
    default: ENROLLMENT_STATUS.ENROLLED,
  },
  grade: {
    type: String,
    default: null,
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: null,
  },
  dropDate: Date,
  completionDate: Date,
}, {
  timestamps: true,
});

// Compound index to ensure a student can't enroll in the same course twice in same semester
enrollmentSchema.index({ student: 1, course: 1, semester: 1, academicYear: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, status: 1 });
enrollmentSchema.index({ course: 1, status: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
