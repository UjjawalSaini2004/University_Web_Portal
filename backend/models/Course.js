const mongoose = require('mongoose');
const { COURSE_STATUS } = require('../utils/constants');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: 1,
    max: 10,
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8,
  },
  type: {
    type: String,
    enum: ['theory', 'practical', 'theory_practical'],
    required: [true, 'Course type is required'],
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  syllabus: String,
  maxStudents: {
    type: Number,
    default: 60,
  },
  status: {
    type: String,
    enum: Object.values(COURSE_STATUS),
    default: COURSE_STATUS.ACTIVE,
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    startTime: String,
    endTime: String,
    room: String,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
courseSchema.index({ code: 1 });
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ faculty: 1 });

// Virtual for enrolled students count
courseSchema.virtual('enrolledCount', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  count: true,
  match: { status: 'enrolled' },
});

module.exports = mongoose.model('Course', courseSchema);
