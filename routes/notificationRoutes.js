const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');


router.post('/notifications', controller.sendNotification);
router.get('/users/:id/notifications', controller.getUserNotifications);

module.exports = router;
