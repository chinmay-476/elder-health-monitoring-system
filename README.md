# Elder Health Monitoring System

A complete MERN stack assignment project for tracking elder patient data, health history, and alerts with secure authentication and role-based access.

## Live Links

- Frontend (Vercel): https://elder-health-monitoring-system.vercel.app
- Frontend (Vercel preview): https://elder-health-monitoring-system-eayis8hl3-chinmay-476s-projects.vercel.app
- Backend (Render): https://elder-health-monitoring-system-ff9u.onrender.com

## Demo Login (Care Manager)

- Email: chinmay@gmail.com
- Password: chin1987

## Tech Stack

- MongoDB with Mongoose
- Express.js
- React with Vite
- Node.js
- JWT authentication
- bcrypt password hashing using `bcryptjs`
- Axios for frontend API calls

## Roles

- `careManager`: can add patients and manage health data
- `parent`: can view linked patient data and use the Emergency Button UI
- `child`: can view linked patient data in read-only mode

## Core Features

- Register and login with JWT authentication
- Protected dashboard
- Role-based UI and API authorization
- Add patient workflow for care managers
- Add health data workflow for care managers
- Patient access code generation for each patient
- Parent and child registration through patient access code
- One parent account per patient and multiple child accounts per patient
- Patient history view
- Alert generation for abnormal vitals
- Parent emergency action button

## Backend Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
└── .env.example
```

## Frontend Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── .env.example
```

## MongoDB Models

### User

- `name`
- `email`
- `password`
- `role`
- `linkedPatient`

### Patient

- `name`
- `age`
- `gender`
- `emergencyContact`
- `accessCode`
- `managedBy`

### HealthRecord

- `patient`
- `heartRate`
- `oxygen`
- `systolicBP`
- `diastolicBP`
- `recordedBy`

### Alert

- `patient`
- `healthRecord`
- `type`
- `message`
- `severity`

## Required API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/health`
- `GET /api/patient/:id`
- `GET /api/alerts`

## Extra API Endpoints Added For Frontend Workflow

- `GET /api/auth/me`
- `GET /api/patients`
- `POST /api/patients`

## Alert Rules

- Heart rate `< 50` or `> 110` creates an alert
- Oxygen `< 92` creates a critical alert
- Blood pressure `> 140/90` creates a warning alert

## Local Setup

### 1. Backend setup

```bash
cd backend
copy .env.example .env
npm install
```

Update `backend/.env`:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/elder-health-monitoring
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

### 2. Frontend setup

```bash
cd ../frontend
copy .env.example .env
npm install
```

Update `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

### 3. Run backend

```bash
cd ../backend
npm run dev
```

### 4. Run frontend

```bash
cd ../frontend
npm run dev
```

### 5. Open the app

```text
http://localhost:5173
```

## Sample Request JSON

### Register

```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com",
  "password": "password123",
  "role": "careManager"
}
```

### Login

```json
{
  "email": "riya@example.com",
  "password": "password123"
}
```

### Add Patient

```json
{
  "name": "Sarla Devi",
  "age": 72,
  "gender": "Female",
  "emergencyContact": {
    "name": "Aman Sharma",
    "phone": "+91 9876543210"
  }
}
```

### Add Health Data

```json
{
  "patientId": "6804b6097f3f4c4f74f17a51",
  "heartRate": 118,
  "oxygen": 89,
  "systolicBP": 150,
  "diastolicBP": 95
}
```

## Simple Interview Explanation

1. This is a MERN stack elder health monitoring system.
2. Users register and login using JWT authentication.
3. Passwords are hashed before saving with bcrypt.
4. Each patient gets a generated access code when the care manager creates the patient.
5. Parent and child accounts are linked to a patient through that access code.
6. Only one parent account is allowed per patient, but multiple child accounts can be created.
7. Role-based access control is enforced in both the backend and frontend.
8. Care managers can add patients and health data.
9. Parents and children can view only their linked patient data, and parents also get an emergency action button.
10. When health data is saved, the backend checks the vitals and automatically creates alerts.

## Render Deployment Steps

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial elder health monitoring system"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create MongoDB Atlas database

1. Create a free Atlas cluster.
2. Create a database user.
3. Allow your IP or use `0.0.0.0/0` for testing.
4. Copy the MongoDB connection string.

### 3. Deploy backend on Render

1. Open Render.
2. Click `New +`.
3. Choose `Web Service`.
4. Connect your GitHub repo.
5. Set `Root Directory` to `backend`.
6. Set `Build Command` to `npm install`.
7. Set `Start Command` to `npm start`.
8. Add environment variables:

```text
MONGO_URI=<your-atlas-uri>
JWT_SECRET=<your-random-secret>
NODE_ENV=production
PORT=5001
CLIENT_URL=https://your-frontend-name.vercel.app
```

9. Deploy and copy the Render backend URL.

## Vercel Deployment Steps

1. Open Vercel.
2. Click `Add New > Project`.
3. Import the same GitHub repository.
4. Set `Root Directory` to `frontend`.
5. Keep framework preset as `Vite`.
6. Add environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

7. Deploy.

## Final Deployment Check

After Vercel gives you the final frontend URL, update Render:

```text
CLIENT_URL=http://localhost:5173,https://your-frontend-name.vercel.app
```

## Deliverables Checklist

- Source code in this repository
- Live backend on Render
- Live frontend on Vercel
- AI usage report
- Interview explanation notes
