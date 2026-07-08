🚛 CargoSetu

CargoSetu is a full-stack reverse-auction freight marketplace connecting shippers with drivers. Senders post loads (cargo needing transport), verified drivers compete by bidding — but unlike a normal auction, the lowest bid wins. Once bidding closes, payment is handled through Razorpay, the platform takes a commission, and the shipment is tracked from pickup through delivery.

Built with the MERN stack (MongoDB, Express, React, Node.js).


Table of Contents


Overview
Features
Tech Stack
Architecture
Project Structure
Getting Started

Prerequisites
Installation
Environment Variables
Running the App



API Overview
User Roles
Load Lifecycle
Known Limitations
Roadmap
License



Overview

Traditional freight pricing is opaque — shippers often overpay because they don't know the market rate, and drivers underprice out of desperation for work. CargoSetu solves this with a reverse auction: shippers post a load with a maximum budget, drivers bid downward within a fixed bidding window, and the lowest bidder wins the job — creating price transparency for both sides.

Features


🔐 JWT-based authentication with role-based access (Admin / Sender / Driver)
📦 Load posting with images (Cloudinary), dimensions, weight, vehicle & cargo type
💰 Reverse-auction bidding with an automatically timed bidding window (opened/closed by a scheduled cron job)
💳 Razorpay payment integration with HMAC signature verification
📊 Admin commission engine — configurable commission %, snapshotted per transaction
🚚 Shipment tracking — Assigned → In Transit → Delivered
⭐ Two-way rating system between senders and drivers after completed shipments
📈 Admin revenue dashboard with commission/earnings breakdown
📧 Automated email notifications for bid placed, bid won, load assigned, delivery confirmation
📱 Responsive UI built with Tailwind CSS


Tech Stack

Frontend


React 19, React Router 7
Redux Toolkit + React-Redux (state management)
Axios (API calls)
Tailwind CSS
Vite (build tool)
React Toastify (notifications)


Backend


Node.js + Express 5
MongoDB + Mongoose 9
JSON Web Tokens (JWT) + bcryptjs
Multer + Cloudinary (image uploads)
Razorpay (payments)
Nodemailer (transactional email)
node-cron (scheduled load status transitions)
express-rate-limit (auth throttling)


Architecture

┌─────────────┐        REST/JSON         ┌──────────────┐        ┌──────────────┐
│   React SPA │ ───────────────────────▶ │  Express API │ ─────▶ │   MongoDB    │
│ (Redux Tk)  │ ◀─────────────────────── │              │ ◀───── │              │
└─────────────┘   cookies + JWT auth     └──────┬───────┘        └──────────────┘
                                                 │
                        ┌────────────────────────┼───────────────────────┐
                        ▼                        ▼                       ▼
                  ┌──────────┐            ┌─────────────┐         ┌─────────────┐
                  │Cloudinary│            │  Razorpay   │         │  Nodemailer │
                  │ (images) │            │ (payments)  │         │  (SMTP)     │
                  └──────────┘            └─────────────┘         └─────────────┘

A node-cron job inside the Express process ticks every minute to open/close
bidding windows and transition Load status automatically.

Layered backend structure: routes → middleware (auth/role guards) → controllers → models.

Project Structure

CargoSetu/
├── backend/
│   ├── config/          # DB, Cloudinary, Razorpay setup
│   ├── controllers/     # Business logic (Load, User, Bidding, Payment, Commission, Rating, Contact)
│   ├── middleWare/       # auth, role guards, rate limiting, error handler
│   ├── models/           # Mongoose schemas (User, Load, Bid, Payment, Rating, CommissionConfig)
│   ├── routes/            # Express route definitions
│   ├── services/          # Email service
│   ├── utils/              # File upload, commission calc, password validation
│   └── server.js           # App entry point + cron scheduler
│
├── frontend/
│   ├── src/
│   │   ├── admin/         # Admin dashboards (revenue, users, load management)
│   │   ├── component/      # Reusable UI components (cards, header, footer, layouts)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/            # Route-level pages (auth, dashboards, load pages)
│   │   ├── redux/              # Slices + service (axios) layer
│   │   ├── routes/               # Route config + PrivateRoute guard
│   │   └── utils/                  # Helpers (URL config, validation, formatting)
│   └── vite.config.js
│
└── package.json           # Root convenience scripts

Getting Started

Prerequisites


Node.js 18+
npm
A MongoDB instance (local or MongoDB Atlas)
Accounts/API keys for: Cloudinary, Razorpay, and an SMTP provider (e.g., Gmail App Password, SendGrid)


Installation

bashgit clone <your-repo-url>
cd CargoSetu

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

Environment Variables

Create a backend/.env file:

env# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM_NAME=CargoSetu
SMTP_FROM_EMAIL=no-reply@yourdomain.com

# Business config
COMMISSION_PERCENTAGE=5

Create a frontend/.env file:

envVITE_BACKEND_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id


⚠️ Never commit .env files. Both are already excluded via .gitignore — double check no real secrets are checked into git history before pushing this repo publicly.



Running the App

bash# Terminal 1 — backend (from /backend)
npm run dev          # starts on http://localhost:5000

# Terminal 2 — frontend (from /frontend)
npm run dev          # starts on http://localhost:5173

Build frontend for production:

bashcd frontend
npm run build         # outputs to frontend/dist

API Overview

ResourceBase RouteNotesAuth / Users/api/usersregister, login, profile, admin user managementLoads/api/Loadscreate/browse/update/delete loads, admin verificationBidding/api/biddingplace/update/withdraw bids, finalize winner, tracking updatesPayments/api/paymentsRazorpay order creation + signature verificationCommission/api/commissioncommission config + revenue dashboard (admin)Ratings/api/ratingspost-delivery ratings & public profile ratingsContact/api/contactcontact form submission

All protected routes require a valid JWT, sent via an httpOnly cookie (set automatically on login) or an Authorization: Bearer <token> header.

User Roles

RoleCapabilitiesSenderPost loads, edit/delete before bidding starts, review bids, finalize a winner, pay, rate the driverDriverBrowse open loads, place/update/withdraw bids, update shipment tracking status, rate the senderAdminVerify loads & set commission, manage users, view/adjust global commission %, view revenue dashboard

Load Lifecycle

OPEN → BIDDING → PAYMENT_PENDING → ASSIGNED → IN_TRANSIT → DELIVERED
                       ↳ ENDED (if no bids received)

A scheduled job checks every minute for loads whose bidding window should open or close, automatically transitioning status and computing the winning (lowest) bid.

Known Limitations

This is an actively developed portfolio/learning project. Known gaps that would need addressing before a real production launch:


No automated test suite yet
Bid placement/finalization isn't wrapped in database transactions (a rare concurrent-bid race is theoretically possible)
No CI/CD pipeline or Dockerfile yet
Single-instance cron scheduling (would need a distributed lock before running multiple server instances)
No pagination on list endpoints yet


Roadmap


 Real-time bid updates via WebSockets
 Automated test coverage (Jest + Supertest)
 Mongo transactions around the bidding/finalization path
 CI/CD pipeline + Dockerized deployment
 Search/filter/pagination on load listings
 Payment timeout & auto-reassignment for unpaid loads


License

This project is available for educational/portfolio purposes. Add a license of your choice (MIT recommended) if open-sourcing.


Built by Himanshu — a MERN stack project developed as part of software engineering placement preparation.
