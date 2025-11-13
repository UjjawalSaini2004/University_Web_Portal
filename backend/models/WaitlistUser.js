const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const waitlistUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      required: [true, 'Please provide a role'],
    },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please provide department'],
    },
    // Student specific fields
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: function () {
        return this.role === 'student';
      },
    },
    admissionYear: {
      type: Number,
      required: function () {
        return this.role === 'student';
      },
    },
    // Teacher/Faculty specific fields
    designation: {
      type: String,
      required: function () {
        return this.role === 'teacher' || this.role === 'faculty';
      },
    },
    qualification: {
      type: String,
      required: function () {
        return this.role === 'teacher' || this.role === 'faculty';
      },
    },
    joiningDate: {
      type: Date,
      required: function () {
        return this.role === 'teacher' || this.role === 'faculty';
      },
    },
    // Admin specific - no additional fields required
    // Admins are only added to waitlist by super_admin
    status: {
      type: String,
      enum: ['pending', 'denied'],
      default: 'pending',
    },
    deniedReason: {
      type: String,
    },
    deniedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
waitlistUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Virtual for full name
waitlistUserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
waitlistUserSchema.set('toJSON', { virtuals: true });
waitlistUserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('WaitlistUser', waitlistUserSchema);
