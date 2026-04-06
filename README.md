# Healthcare Appointment System

A full-stack healthcare booking platform where users can browse doctors, hospitals, and lab tests, then manage appointments through a modern web interface.

## Live Demo

Frontend: https://healthcare-appointment-system-beta.vercel.app

Backend API: https://healthcare-backend-18e1.onrender.com

## Features

- User registration and login
- Admin login and dashboard
- Doctor and hospital listings
- Lab test browsing and booking
- Appointment booking and management
- Profile management
- Image upload support with Cloudinary

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Media Storage: Cloudinary
- Deployment: Vercel and Render

## Project Structure

```text
healthcare-appointment-system/
├── client/   # React frontend
├── server/   # Express backend
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/healthcare-appointment-system.git
cd healthcare-appointment-system
```

### 2. Configure backend environment variables

Create `server/.env` and add:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_ALT=https://your-frontend-domain.vercel.app
```

### 3. Install dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd ../client
npm install
```

### 4. Run the project

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Frontend uses `VITE_BACKEND_URL`
- Backend uses `FRONTEND_URL` and `FRONTEND_URL_ALT` for CORS

## Notes

- The Render free tier may sleep after inactivity, so the first API request can be slow.
- Do not commit `.env` files or other secrets to GitHub.
- If you rotate secrets, update both Render and your local `server/.env`.
