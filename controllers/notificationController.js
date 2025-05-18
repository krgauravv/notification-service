const { publishToQueue } = require('../queue/rabbitmq');

// In-memory database (can replace with MongoDB later)
const mockDB = {};

exports.sendNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  if (!userId || !type || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supportedTypes = ['email', 'sms', 'in-app'];
  if (!supportedTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid notification type' });
  }

  // Build payload
  const notification = {
    userId,
    type,
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    // Publish to queue
    await publishToQueue('notifications', notification);

    // Store in memory (optional; for GET)
    if (!mockDB[userId]) mockDB[userId] = [];
    mockDB[userId].push(notification);

    res.status(200).json({ status: 'Notification queued successfully' });
  } catch (error) {
    console.error('❌ Error queuing notification:', error.message);
    res.status(500).json({ error: 'Failed to queue notification' });
  }
};

// GET /users/:id/notifications
exports.getUserNotifications = (req, res) => {
  const userId = req.params.id;
  const notifications = mockDB[userId] || [];
  res.status(200).json(notifications);
};
