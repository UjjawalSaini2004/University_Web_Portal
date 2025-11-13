const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
      'ADMIN_CREATED', 'ADMIN_APPROVED', 'ADMIN_DENIED',
      'TEACHER_CREATED', 'TEACHER_APPROVED', 'TEACHER_DENIED',
      'STUDENT_CREATED', 'STUDENT_APPROVED', 'STUDENT_DENIED',
      'COURSE_CREATED', 'COURSE_UPDATED', 'COURSE_DELETED',
      'CERTIFICATE_APPROVED', 'CERTIFICATE_REJECTED',
      'DEPARTMENT_CREATED', 'DEPARTMENT_UPDATED', 'DEPARTMENT_DELETED',
      'ROLE_CHANGED', 'SETTINGS_UPDATED',
      'LOGIN', 'LOGOUT', 'PASSWORD_CHANGED'
    ]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performedByName: {
    type: String,
    required: true
  },
  performedByRole: {
    type: String,
    required: true
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetUserName: {
    type: String
  },
  targetModel: {
    type: String,
    enum: ['User', 'Course', 'Certificate', 'Department', 'Settings', null]
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
activityLogSchema.index({ performedBy: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
