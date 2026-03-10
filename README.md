# Incident Management System

A full-stack Incident Management System designed for engineering teams to track, assign, and resolve system incidents, built with Next.js (Frontend) and Node.js/Express (Backend).

## Architecture Overview

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS 4, Framer Motion, Zustand (State Management).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB via Mongoose.
- **Authentication:** Custom JWT-based authentication.

The architecture ensures team isolation, meaning users only see incidents associated with their team. When a user signs up with a specific `teamName`, the backend dynamically creates the team or assigns the user to the existing team. This seamless flow allows for easy user onboarding.

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4 + `tailwindcss/postcss`
- Framer Motion (for smooth micro-animations)
- Zustand (Global State)
- Axios (API Client)
- Lucide React (Icons)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- bcryptjs (Password hashing)

## Setup Steps

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (update `.env` in backend)

### 1. Backend Setup
1. Open terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variable (optional if backend is on `localhost:5000`). Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## Example Login Credentials

You can create a new account easily on the Signup page. However, here is an example:

**User 1:**
- **Email:** demo@example.com
- **Password:** password123
- **Team Name:** Engineering

**User 2 (same team):**
- **Email:** user2@example.com
- **Password:** password123
- **Team Name:** Engineering

## Deployment Readiness

- The **Frontend** can be easily deployed to Vercel by importing the Next.js project. It has been tested and builds successfully with `npm run build`.
- The **Backend** can be deployed to Render, Railway, or any Node.js hosting platform. Ensure the `.env` variables are securely set.
- Add your live URLs, schema screenshots, and GitHub repos to this document before final submission.
