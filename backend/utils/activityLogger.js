const ActivityLog = require('../models/ActivityLog');

/**
 * Create an activity log entry
 * @param {Object} data - Activity log data
 * @param {String} data.action - Action type
 * @param {ObjectId} data.performedBy - User who performed the action
 * @param {String} data.performedByName - Name of user who performed action
 * @param {String} data.performedByRole - Role of user who performed action
 * @param {String} data.description - Description of the action
 * @param {ObjectId} data.targetUser - Target user (optional)
 * @param {String} data.targetUserName - Name of target user (optional)
 * @param {String} data.targetModel - Target model type (optional)
 * @param {ObjectId} data.targetId - Target document ID (optional)
 * @param {Object} data.metadata - Additional metadata (optional)
 * @param {String} data.ipAddress - IP address (optional)
 * @param {String} data.userAgent - User agent (optional)
 */
const createActivityLog = async (data) => {
  try {
    const log = await ActivityLog.create({
      action: data.action,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
      performedByRole: data.performedByRole,
      description: data.description,
      targetUser: data.targetUser || null,
      targetUserName: data.targetUserName || null,
      targetModel: data.targetModel || null,
      targetId: data.targetId || null,
      metadata: data.metadata || {},
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null
    });
    return log;
  } catch (error) {
    console.error('Error creating activity log:', error);
    // Don't throw error - logging should not break the main operation
    return null;
  }
};

/**
 * Get activity logs with filtering and pagination
 */
const getActivityLogs = async ({ 
  page = 1, 
  limit = 50, 
  action, 
  performedBy, 
  startDate, 
  endDate 
}) => {
  try {
    const query = {};
    
    if (action) query.action = action;
    if (performedBy) query.performedBy = performedBy;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('performedBy', 'firstName lastName email role')
        .populate('targetUser', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    throw error;
  }
};

/**
 * Get recent activities (for dashboard)
 */
const getRecentActivities = async (limit = 10) => {
  try {
    const logs = await ActivityLog.find()
      .populate('performedBy', 'firstName lastName email role')
      .populate('targetUser', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return logs;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
};

/**
 * Get activity statistics
 */
const getActivityStats = async () => {
  try {
    const stats = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const total = await ActivityLog.countDocuments();
    const today = await ActivityLog.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    return {
      total,
      today,
      byAction: stats
    };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    throw error;
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getRecentActivities,
  getActivityStats
};
