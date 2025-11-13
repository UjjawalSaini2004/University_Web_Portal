const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10,
  },
  description: {
    type: String,
    required: [true, 'Department description is required'],
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  establishedYear: {
    type: Number,
    required: [true, 'Established year is required'],
  },
  building: String,
  floor: String,
  contactEmail: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  contactPhone: String,
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for courses count
departmentSchema.virtual('coursesCount', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'department',
  count: true,
});

// Virtual for students count
departmentSchema.virtual('studentsCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  count: true,
  match: { role: 'student' },
});

// Virtual for faculty count
departmentSchema.virtual('facultyCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  count: true,
  match: { role: 'faculty' },
});

module.exports = mongoose.model('Department', departmentSchema);
