
# 📬 Notification Service (Node.js + RabbitMQ + MongoDB)

[](https://www.google.com/search?q=%23)
[](https://www.google.com/search?q=%23)
[](https://www.google.com/search?q=%23)
[](https://www.google.com/search?q=%23)
[](https://www.google.com/search?q=%23)

> A backend microservice that sends notifications via **Email**, **SMS (simulated)**, and **In-App** using **RabbitMQ** for asynchronous processing and **MongoDB** for storing in-app notifications. Secured with **JWT authentication**.

🔗 **Live Demo:** [**Notification Service on Render**](https://notification-service-v3ro.onrender.com/)

-----

## 🚀 Features

  - `POST /api/notifications` — Send a notification to the queue for processing.
  - `GET /api/users/:id/notifications` — Retrieve a user’s in-app notifications.
  - **Email delivery** using **Nodemailer**.
  - **SMS delivery** is **simulated** (logs to the console; can be swapped with Twilio/Nexmo).
  - **In-app notifications** are persisted in **MongoDB**.
  - **RabbitMQ** integration for asynchronous, decoupled processing.
  - Basic **retry logic** for handling transient message failures.
  - **JWT authentication** for securing API endpoints.

-----

## 🧭 High-Level Flow

This diagram shows how a request flows through the system from the API to the final notification delivery.

```
Client -> (JWT) -> Express API -> Publish to RabbitMQ Queue
                                   |
                                   v
                              Worker (Consumer)
                           /        |         \
                      EmailSvc   SmsSvc    InAppSvc (Mongo)
```

-----

## 📂 Project Structure

```
notification-service/
├── app.js                # Main server file
├── worker.js             # RabbitMQ consumer worker
├── .env                  # Environment variables
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
├── middleware/
│   └── authenticate.js
├── models/
│   └── Notification.js
└── package.json
```

-----

## 🔧 Setup Instructions

### 1\. Clone the Repository

```bash
git clone https://github.com/krgauravv/notification-service.git
cd notification-service
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Create `.env` file

Create a file named `.env` in the root directory and populate it with your configuration.

```env
# Server Configuration
PORT=3000

# RabbitMQ & MongoDB
RABBITMQ_URL=amqp://localhost
MONGO_URI=mongodb://localhost:27017/notification_service

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key

# Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> 💡 **Important:** For `EMAIL_PASS`, you must use a [**Gmail App Password**](https://myaccount.google.com/apppasswords), not your regular account password.

### 4\. Start Databases & Services

You need running instances of MongoDB and RabbitMQ.

**MongoDB:**

```bash
# Start the MongoDB daemon
mongod
```

**RabbitMQ (via Docker is easiest):**

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3-management
```

  - The management UI will be available at [http://localhost:15672](https://www.google.com/search?q=http://localhost:15672).
  - Default credentials are `guest` / `guest`.

### 5\. Start the Application

You need to run two separate processes in two different terminals.

**Terminal 1: Start the API Server**

```bash
node app.js
```

**Terminal 2: Start the Worker**

```bash
node worker.js
```

-----

## 📬 API Usage

### 🔐 Authentication

First, get a JWT by sending a `POST` request to the `/login` endpoint.

**Request:**

```bash
curl -X POST http://localhost:3000/login \
 -H "Content-Type: application/json" \
 -d '{ "username": "test", "password": "test" }'
```

**Response:**

```json
{
  "token": "your_generated_jwt_token"
}
```

Use this token as a `Bearer` token in the `Authorization` header for all subsequent requests.

### 1\) Send a Notification

**Endpoint:** `POST /api/notifications`

**Body:**

```json
{
  "userId": "example@gmail.com",
  "type": "email",
  "message": "Your order has been shipped!"
}
```

  - `type` can be `"email"`, `"sms"`, or `"in-app"`.

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/notifications \
 -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
 -H "Content-Type: application/json" \
 -d '{ "userId": "example@gmail.com", "type": "email", "message": "Hello from the notification service!" }'
```

### 2\) Get User's In-App Notifications

**Endpoint:** `GET /api/users/:id/notifications`

**Example cURL:**

```bash
curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
 http://localhost:3000/api/users/example@gmail.com/notifications
```

**Response:**

```json
[
  {
    "_id": "66be0e10a5d9c1d3e5f53c88",
    "userId": "example@gmail.com",
    "message": "Hello from in-app!",
    "read": false,
    "timestamp": "2025-08-14T12:00:00.000Z"
  }
]
```

-----

## 🧠 Assumptions

  - The `userId` field is flexible and can represent an email, phone number, or internal ID.
  - SMS sending is simulated by logging to the console.
  - The retry logic is basic, attempting a failed message one additional time.

-----

## 👨‍💼 Author

  - **Name:** Gaurav Kumar
  - **GitHub:** [@krgauravv](https://github.com/krgauravv)
