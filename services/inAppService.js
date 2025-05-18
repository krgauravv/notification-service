const inAppDB = {}; 

exports.sendNotification = async (userId, message) => {
  if (!inAppDB[userId]) inAppDB[userId] = [];
  inAppDB[userId].push({ message, timestamp: new Date().toISOString() });
  console.log(`💬 In-app notification stored for ${userId}`);
};
