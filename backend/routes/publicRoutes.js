const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const logger = require('../utils/logger');

/**
 * @desc    Get all active departments (public)
 * @route   GET /api/public/departments
 * @access  Public
 */
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select('name code description')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    logger.error(`Error fetching departments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching departments.',
    });
  }
});

module.exports = router;
