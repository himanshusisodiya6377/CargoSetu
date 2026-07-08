# CargoSetu 🚛

### Smart Logistics & Freight Bidding Platform

CargoSetu is a full-stack logistics marketplace that connects **Senders** with **Truck Drivers** through a transparent bidding system. Instead of manually searching for transporters, senders can post freight loads, receive competitive bids from verified drivers, compare offers, and finalize the shipment securely.

The platform streamlines freight booking, bidding, payment, shipment tracking, and user management while providing role-based access for **Admin**, **Sender**, and **Driver**.

---

## ✨ Features

### 👤 Authentication & User Management

* Secure user registration and login
* JWT-based authentication
* Role-based authorization (Admin, Sender, Driver)
* Profile management
* Become a Sender functionality
* User profile image upload
* Protected routes
* Rate-limited authentication APIs

---

### 📦 Load Management

* Create freight loads
* Update existing loads
* Delete loads
* View all available loads
* View active loads
* View completed loads
* View personal posted loads
* Upload multiple load images
* Admin load management

---

### 💰 Live Bidding System

* Drivers can place bids on loads
* Update existing bids
* Delete bids
* View bidding history
* Finalize winning bid
* View won loads
* Driver bidding dashboard
* Admin bid management

---

### 🚚 Shipment Tracking

* Real-time shipment status updates
* Driver tracking status updates
* Active shipment management
* Completed shipment history

---

### 💳 Secure Payments

* Razorpay payment integration
* Secure payment verification
* Payment history
* Payment details for every shipment

---

### ⭐ Rating & Reviews

* Rate completed shipments
* Public user profiles
* Driver ratings
* Sender ratings
* Reputation-based trust system

---

### 📈 Admin Dashboard

* Manage users
* Manage loads
* Manage bids
* Commission configuration
* Revenue dashboard
* Enable/Disable bidding
* Delete inappropriate content

---

### 📧 Contact System

* Contact form submission
* Customer support requests

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Redux Toolkit
* Axios
* React Toastify
* React Icons
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* Razorpay
* Nodemailer
* Express Rate Limit
* Node Cron

---

## 📂 Project Structure

```text
CargoSetu
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── server.js
│
└── package.json
```

---

## 🔐 User Roles

### Sender

* Post freight loads
* Edit/Delete own loads
* View received bids
* Accept winning bid
* Make shipment payments
* Rate drivers

### Driver

* Browse available loads
* Place bids
* Update/Delete bids
* Track shipments
* View won loads
* Receive ratings

### Admin

* Manage users
* Manage loads
* Manage bids
* Configure commission
* Monitor revenue
* Moderate platform activities

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd CargoSetu
```

---

### Backend Setup

```bash
cd backend

npm install

npm start
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

EMAIL=
EMAIL_PASSWORD=
```

### Frontend (.env)

```env
VITE_BACKEND_URL=
```

---

## 🔄 Application Workflow

1. User registers and logs in.
2. A sender posts a freight load with shipment details.
3. Drivers browse available loads and submit competitive bids.
4. The sender reviews all bids and selects the best offer.
5. Payment is completed securely through Razorpay.
6. The assigned driver updates shipment status during transit.
7. After successful delivery, both parties can rate each other.
8. Admin monitors platform activity, commissions, and user management.

---

## 📌 Key Highlights

* Role-Based Access Control (RBAC)
* RESTful API Architecture
* JWT Authentication
* Secure Payment Integration
* Image Upload Support
* Freight Bidding Marketplace
* Shipment Tracking
* Rating & Review System
* Admin Revenue Dashboard
* Commission Management
* Responsive User Interface
* Scalable MVC Backend Structure

---

## 📈 Future Improvements

* Live location tracking using GPS
* Real-time notifications with WebSockets
* AI-based freight price prediction
* Route optimization
* Multi-language support
* Mobile application
* In-app chat between sender and driver
* Advanced analytics dashboard
* Email and SMS notifications
* Digital invoice generation

---

## 👨‍💻 Author

Developed as a full-stack logistics marketplace project to demonstrate modern web development concepts, scalable backend architecture, secure authentication, payment integration, and real-world logistics workflow automation.
