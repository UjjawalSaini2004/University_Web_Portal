const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
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
  assessments: {
    internal1: {
      marks: { type: Number, min: 0, max: 100, default: 0 },
      maxMarks: { type: Number, default: 20 },
    },
    internal2: {
      marks: { type: Number, min: 0, max: 100, default: 0 },
      maxMarks: { type: Number, default: 20 },
    },
    assignments: {
      marks: { type: Number, min: 0, max: 100, default: 0 },
      maxMarks: { type: Number, default: 10 },
    },
    endSemester: {
      marks: { type: Number, min: 0, max: 100, default: 0 },
      maxMarks: { type: Number, default: 50 },
    },
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  maxTotalMarks: {
    type: Number,
    default: 100,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
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
  remarks: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required'],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedDate: Date,
}, {
  timestamps: true,
});

// Compound index to ensure one grade record per student per course
gradeSchema.index({ student: 1, course: 1, semester: 1, academicYear: 1 }, { unique: true });
gradeSchema.index({ course: 1 });
gradeSchema.index({ student: 1 });

// Calculate total marks before saving
gradeSchema.pre('save', function(next) {
  const assessments = this.assessments;
  this.totalMarks = 
    assessments.internal1.marks + 
    assessments.internal2.marks + 
    assessments.assignments.marks + 
    assessments.endSemester.marks;
  
  this.maxTotalMarks = 
    assessments.internal1.maxMarks + 
    assessments.internal2.maxMarks + 
    assessments.assignments.maxMarks + 
    assessments.endSemester.maxMarks;
  
  this.percentage = this.maxTotalMarks > 0 
    ? ((this.totalMarks / this.maxTotalMarks) * 100).toFixed(2) 
    : 0;
  
  // Calculate grade
  const { calculateGrade, calculateGPA } = require('../utils/helpers');
  this.grade = calculateGrade(this.percentage);
  this.gpa = calculateGPA(this.grade);
  
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
