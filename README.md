📅 DayPlanner

A full-featured Google Calendar–style application built with React, Node.js, and MongoDB.
DayPlanner allows users to create, edit, delete, and manage events with reminders, authentication, and multiple calendar views.

🚀 Features
🗓️ Calendar Views

Month View

Week View

Day View

Navigation with Today, Previous, and Next controls

📝 Event Management

Create events by clicking a date/time slot

Edit existing events

Delete events

View event details

Color-coded events

📌 Event Details

Every event supports:

Title (required)

Description

Start & End time

Location

Color selection

Reminders (10 min, 1 hour, 1 day, custom)

Recurrence (Daily / Weekly / Monthly / Yearly)

🔐 User Authentication

Sign Up

Sign In

Secure Logout

Protected user routes

JWT-based authentication

🏗️ Technology Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

shadcn/ui

React Router

date-fns

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcryptjs

CORS

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Rakesh200416/DayPlanner.git
cd DayPlanner

2️⃣ Install frontend dependencies
npm install

3️⃣ Install backend dependencies
cd backend
npm install

🔧 Environment Variables

Create a .env file inside backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

🏃 Development Mode
Start frontend:
npm run dev

Start backend:
cd backend
npm start

🏭 Production Mode
Build the frontend:
npm run build

Start the backend:
cd backend
npm start

Serve frontend build:

Use any static hosting (Netlify, Vercel, Nginx, Apache, etc.)

📡 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Log in user
GET	/api/auth/profile	Get user profile
📅 Events
Method	Endpoint	Description
GET	/api/events	Get all events
GET	/api/events/:id	Get event by ID
POST	/api/events	Create a new event
PUT	/api/events/:id	Update event
DELETE	/api/events/:id	Delete event
🔍 Troubleshooting
CORS Issues

Ensure frontend and backend URLs match the CORS configuration.

MongoDB Connection Failed

Check your MongoDB URI

Ensure IP access is allowed in MongoDB Atlas

Authentication Not Working

Make sure JWT_SECRET is set in .env

Check local storage token

“Failed to fetch” Errors

Ensure both frontend & backend are running

Verify API base URL

🤝 Contributing

Fork this repository

Create a new branch

Make your changes

Commit with a clear message

Push to your branch

Open a Pull Request
