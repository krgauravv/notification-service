# 📬 Notification Service (Node.js + RabbitMQ + MongoDB)

A backend microservice that sends notifications via **Email**, **SMS (simulated)**, and **In-App** using **RabbitMQ** for asynchronous processing and **MongoDB** for storing in-app notifications. Secured with **JWT authentication**.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](#)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.x-FF6600?logo=rabbitmq&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-secured-black?logo=jsonwebtokens&logoColor=white)](#)

> 🔗 **Live Demo**  
> _Optional — add your Render/Deployment link here_

---

## 🚀 Features

- `POST /api/notifications` — Send a notification to the queue
- `GET /api/users/:id/notifications` — Retrieve a user’s in-app notifications
- Email delivery using **Nodemailer**
- SMS delivery **simulated** (console log; swap with Twilio/Nexmo later)
- In-app notifications persisted in **MongoDB**
- **RabbitMQ** integration for async processing
- Basic **retry** logic for failed messages
- **JWT** authentication for secure access

---

## 🧱 Project Structure



notification-service/
├── app.js # Main server file
├── .env # Environment variables
├── controllers/
│ └── notificationController.js # API controller functions
├── routes/
│ └── notificationRoutes.js # API routes
├── queue/
│ └── rabbitmq.js # RabbitMQ connection and publisher
├── services/
│ ├── emailService.js # Email sending logic
│ ├── smsService.js # SMS sending (simulated)
│ └── inAppService.js # MongoDB-based in-app notification service
├── middleware/
│ └── authenticate.js # JWT authentication middleware
├── models/
│ └── Notification.js # MongoDB schema for notifications
├── worker.js # RabbitMQ consumer worker
└── package.json


---

## 🔧 Setup Instructions

### 1) Clone the Repository
```bash
git clone https://github.com/krgauravv/notification-service.git
cd notification-service

2) Install Dependencies
npm install

3) Create .env file
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password      # Use Gmail App Passwords
RABBITMQ_URL=amqp://localhost
MONGO_URI=mongodb://localhost:27017/notification_service
JWT_SECRET=your_jwt_secret

4) Start MongoDB
mongod

5) Start RabbitMQ

Local install:

rabbitmq-server


Or via Docker:

docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management


Management UI: http://localhost:15672 (default user/pass: guest/guest)

6) Start the Server
node app.js

7) Start the Worker (separate terminal)
node worker.js

🔐 Authentication

A simple login route issues a JWT for testing:

Request

POST /login
Content-Type: application/json

{
  "username": "test",
  "password": "test"
}


Response

{
  "token": "your_generated_jwt_token"
}


Use this token as a Bearer token for protected endpoints.

📬 API Usage
1) Send a Notification

Endpoint

POST /api/notifications
Authorization: Bearer <your_jwt_token>
Content-Type: application/json


Body

{
  "userId": "example@gmail.com",
  "type": "email", // "email" | "sms" | "in-app"
  "message": "Your message here"
}


Response

{
  "status": "success",
  "message": "Notification queued"
}


cURL

curl -X POST http://localhost:3000/api/notifications \
 -H "Authorization: Bearer <TOKEN>" \
 -H "Content-Type: application/json" \
 -d '{
   "userId": "example@gmail.com",
   "type": "email",
   "message": "Hello from email!"
 }'

2) Get User In-App Notifications

Endpoint

GET /api/users/:id/notifications
Authorization: Bearer <your_jwt_token>


Example

curl -H "Authorization: Bearer <TOKEN>" \
 http://localhost:3000/api/users/example@gmail.com/notifications


Response

[
  {
    "_id": "66be0e10a5d9c1d3e5f53c88",
    "userId": "example@gmail.com",
    "message": "Hello from in-app!",
    "timestamp": "2025-08-14T12:00:00.000Z"
  }
]

🧠 Assumptions

userId can be an email, phone number, or internal app user ID.

SMS sending is simulated (console log). Replace with a provider like Twilio/Nexmo.

MongoDB is used for in-app notification persistence.

Retry logic is limited to 1 attempt.

🗂️ Environment & Scripts (optional)

If you prefer npm scripts, add something like this to package.json:

{
  "scripts": {
    "start": "node app.js",
    "worker": "node worker.js",
    "dev": "nodemon app.js",
    "dev:worker": "nodemon worker.js"
  }
}


Then run:

npm run start
npm run worker
# or for live reload (if nodemon installed)
npm run dev
npm run dev:worker

🧭 High-Level Flow
Client -> (JWT) -> Express API -> Publish to RabbitMQ Queue
                                   |
                                   v
                              Worker (Consumer)
                           /        |         \
                      EmailSvc   SmsSvc    InAppSvc (Mongo)

🧪 Quick Health Checks

API up: GET http://localhost:3000/health (if implemented)

RabbitMQ UI: http://localhost:15672

MongoDB: connect using mongosh and check notification_service.notifications collection

🧯 Troubleshooting

ECONNREFUSED to RabbitMQ
Ensure RabbitMQ is running and RABBITMQ_URL is correct. If using Docker, confirm port 5672 is exposed.

Email not sending
Use Gmail App Passwords. Enable “Less secure app access” is deprecated; App Passwords are required.

JWT invalid/expired
Re-login via /login and use the new token. Verify JWT_SECRET matches server config.

Mongo connection errors
Check MONGO_URI, that mongod is running, and your network/ports are accessible.

📄 License

MIT © Gaurav Kumar — @krgauravv


If you want, I can also generate minimal sample implementations for each file so your repo runs end-to-end out of the box.
