const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

/**
 * Delete file from filesystem
 * @param {string} filePath - Path to file
 */
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    await fs.unlink(fullPath);
    logger.info(`File deleted: ${filePath}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting file: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Get file info
 * @param {string} filePath - Path to file
 */
const getFileInfo = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const stats = await fs.stat(fullPath);
    
    return {
      success: true,
      info: {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      },
    };
  } catch (error) {
    logger.error(`Error getting file info: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Check if file exists
 * @param {string} filePath - Path to file
 */
const fileExists = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  deleteFile,
  getFileInfo,
  fileExists,
};
