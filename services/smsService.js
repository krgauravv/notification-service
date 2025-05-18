exports.sendSMS = async (phoneNumber, message) => {
  try {
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
   
  } catch (error) {
    console.error(`Failed to send SMS to ${phoneNumber}:`, error.message);
    throw error;
  }
};
