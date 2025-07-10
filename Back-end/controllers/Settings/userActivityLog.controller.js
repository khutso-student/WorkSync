const UserActivityLog = require('../../models/UserActivityLo');
const User = require('../../models/User');

// Get paginated user activity logs
exports.getUserActivityLogs = async (req, res) => {
  try {
    // Optional query params for pagination: page & limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Fetch logs with user details
    const logs = await UserActivityLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email role'); // populate user basic info

    const totalLogs = await UserActivityLog.countDocuments();

    res.json({
      logs,
      pagination: {
        total: totalLogs,
        page,
        pages: Math.ceil(totalLogs / limit),
      }
    });
  } catch (err) {
    console.error('Error fetching user activity logs:', err);
    res.status(500).json({ message: 'Failed to fetch user activity logs' });
  }
};
