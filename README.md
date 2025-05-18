# 📬 Notification Service (Node.js + RabbitMQ)

A backend notification service that supports sending notifications via **Email**, **SMS** (simulated), and **In-App** using **RabbitMQ** for message queuing.

---

## 🚀 Features

* `POST /api/notifications` — send notification to queue
* `GET /api/users/:id/notifications` — get user notifications
* Email delivery using Nodemailer
* SMS (console simulated)
* In-app notifications (stored in-memory)
* RabbitMQ integration
* Basic retry logic for failed messages

---

## 💠 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/krgauravv/notification-service.git
cd notification-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RABBITMQ_URL=amqp://localhost
```

> 💡 Use Gmail App Passwords: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 4. Start RabbitMQ

```bash
rabbitmq-server
```

*Or use Docker:*

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### 5. Run the server

```bash
node app.js
```

---

## 📬 API Usage

### 1. Send a Notification

```http
POST /api/notifications
Content-Type: application/json

{
  "userId": "example@gmail.com",  // or phone number or ID
  "type": "email" | "sms" | "in-app",
  "message": "Your message here"
}
```

### 2. Get User Notifications

```http
GET /api/users/:id/notifications
```

---

## 📆 Technologies

* Node.js
* Express
* RabbitMQ
* Nodemailer
* JavaScript

---

## 🧠 Assumptions

* `userId` may represent email, phone, or user ID depending on type.
* SMS sending is simulated using a console log.
* In-app notifications are stored in memory only.
* Retry logic is limited to one attempt.

---

## 📂 Project Structure

```
notification-service/
├── app.js
├── .env
├── controllers/
│   └── notificationController.js
├── routes/
│   └── notificationRoutes.js
├── queue/
│   └── rabbitmq.js
├── services/
│   ├── emailService.js
│   ├── smsService.js
│   └── inAppService.js
```

## 👨‍💼 Author

* Name: Gaurav Kumar
* GitHub: [@krgauravv](https://github.com/krgauravv)
