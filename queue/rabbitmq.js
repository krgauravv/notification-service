const amqp = require('amqplib');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const inAppService = require('../services/inAppService');

let channel;
const QUEUE = 'notifications';

async function connect() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE);

    console.log('✅ Connected to RabbitMQ, waiting for messages...');

    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log("📨 Received from queue:", data);

        try {
          // Handle different notification types
          switch (data.type) {
            case 'email':
              await emailService.sendEmail(data.userId, data.message);
              break;
            case 'sms':
              await smsService.sendSMS(data.userId, data.message);
              break;
            case 'in-app':
              await inAppService.sendNotification(data.userId, data.message);
              break;
            default:
              throw new Error(`Unknown notification type: ${data.type}`);
          }

          channel.ack(msg);

        } catch (error) {
          console.error(`❌ Failed to process ${data.type}:`, error.message);

          // Retry logic: one retry only
          if (!data.retried) {
            console.log(`🔁 Retrying notification for ${data.userId}...`);
            data.retried = true; 
            await publishToQueue(QUEUE, data);
          } else {
            console.warn(`🛑 Giving up after 1 retry for ${data.userId}`);
          }

          channel.ack(msg);
        }
      }
    });

  } catch (err) {
    console.error("❌ Failed to connect to RabbitMQ:", err);
  }
}

connect();

// Function to publish to queue
async function publishToQueue(queueName, data) {
  if (!channel) {
    console.error('❌ Channel not initialized');
    return;
  }

  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

module.exports = { publishToQueue };
