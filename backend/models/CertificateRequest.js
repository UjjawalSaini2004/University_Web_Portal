const mongoose = require('mongoose');
const { CERTIFICATE_TYPES, CERTIFICATE_STATUS } = require('../utils/constants');

const certificateRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  certificateType: {
    type: String,
    enum: Object.values(CERTIFICATE_TYPES),
    required: [true, 'Certificate type is required'],
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
  },
  status: {
    type: String,
    enum: Object.values(CERTIFICATE_STATUS),
    default: CERTIFICATE_STATUS.PENDING,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  approvedDate: Date,
  rejectedReason: String,
  certificateNumber: String,
  issueDate: Date,
  validUntil: Date,
  documentUrl: String,
  remarks: String,
}, {
  timestamps: true,
});

// Indexes
certificateRequestSchema.index({ student: 1, status: 1 });
certificateRequestSchema.index({ status: 1, requestDate: -1 });

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);
