const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../utils/constants');

const attendanceSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  status: {
    type: String,
    enum: Object.values(ATTENDANCE_STATUS),
    required: [true, 'Attendance status is required'],
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Marked by is required'],
  },
  remarks: String,
  classType: {
    type: String,
    enum: ['lecture', 'practical', 'tutorial'],
    default: 'lecture',
  },
}, {
  timestamps: true,
});

// Compound index to ensure one attendance record per student per course per date
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });
attendanceSchema.index({ course: 1, date: 1 });
attendanceSchema.index({ student: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
