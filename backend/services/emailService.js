const { sendEmail } = require('../config/email');
const logger = require('../utils/logger');

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to University Portal';
  const text = `Hello ${user.firstName},\n\nWelcome to the University Management Portal!\n\nYour account has been successfully created.\n\nBest regards,\nUniversity Administration`;
  const html = `
    <h1>Welcome to University Portal</h1>
    <p>Hello ${user.firstName},</p>
    <p>Welcome to the University Management Portal!</p>
    <p>Your account has been successfully created with the role of <strong>${user.role}</strong>.</p>
    <p>Best regards,<br>University Administration</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send email verification email
 */
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const subject = 'Email Verification';
  const text = `Please verify your email by clicking on the following link: ${verificationUrl}`;
  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${user.firstName},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>Best regards,<br>University Administration</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Click the following link to reset your password: ${resetUrl}`;
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${user.firstName},</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>Best regards,<br>University Administration</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send certificate approval notification
 */
const sendCertificateApprovalEmail = async (user, certificateType) => {
  const subject = 'Certificate Request Approved';
  const text = `Your ${certificateType} certificate request has been approved.`;
  const html = `
    <h1>Certificate Request Approved</h1>
    <p>Hello ${user.firstName},</p>
    <p>Your <strong>${certificateType}</strong> certificate request has been approved.</p>
    <p>You can download it from your dashboard.</p>
    <p>Best regards,<br>University Administration</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Send grade notification email
 */
const sendGradeNotificationEmail = async (user, course) => {
  const subject = 'New Grade Posted';
  const text = `A new grade has been posted for ${course.name}.`;
  const html = `
    <h1>New Grade Posted</h1>
    <p>Hello ${user.firstName},</p>
    <p>A new grade has been posted for <strong>${course.name}</strong>.</p>
    <p>Login to your dashboard to view your grade.</p>
    <p>Best regards,<br>University Administration</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendCertificateApprovalEmail,
  sendGradeNotificationEmail,
};
