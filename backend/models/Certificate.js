const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  certificateType: {
    type: String,
    enum: ['completion', 'achievement', 'participation', 'excellence'],
    default: 'completion',
  },
  certificateNumber: {
    type: String,
    unique: true,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'issued'],
    default: 'pending',
  },
  grade: {
    type: String,
  },
  description: {
    type: String,
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  approvedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  rejectedAt: {
    type: Date,
  },
  downloadUrl: {
    type: String,
  },
  verificationCode: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  timestamps: true,
});

// Generate certificate number before saving
certificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const count = await mongoose.model('Certificate').countDocuments();
    const year = new Date().getFullYear();
    this.certificateNumber = `CERT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
