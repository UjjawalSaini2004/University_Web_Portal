const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
  },
  category: {
    type: String,
    enum: ['notes', 'assignment', 'reference', 'previous_papers', 'syllabus', 'other'],
    default: 'notes',
  },
  tags: [String],
  downloadCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
studyMaterialSchema.index({ course: 1, category: 1 });
studyMaterialSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
