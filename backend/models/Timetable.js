const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required'],
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
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    slots: [{
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      room: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['lecture', 'practical', 'tutorial'],
        default: 'lecture',
      },
    }],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index for unique timetable per department, semester, and academic year
timetableSchema.index({ department: 1, semester: 1, academicYear: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
