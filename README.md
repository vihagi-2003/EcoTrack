# EcoTrack – Smart Waste Collection Management System

## 1. Project Overview

EcoTrack is a full-stack web-based Smart Waste Collection Management System developed to improve and simplify waste collection activities.

The system provides a centralized platform where users can submit waste collection requests, view collection schedules, manage complaints, and access recycling-related information. It also supports administrative activities through dedicated management features and a dashboard.

The main purpose of EcoTrack is to make waste collection activities more organized, efficient, and environmentally friendly.

## 2. Project Objectives

- Simplify the waste collection request process.
- Improve waste collection management.
- Organize collection schedules and routes.
- Support collector management activities.
- Provide a platform for complaint management.
- Promote recycling awareness and management.
- Provide an easy-to-use interface for users and administrators.

## 3. Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Google Maps API

### Backend
- Node.js
- Express.js
- RESTful API

### Database
- MongoDB
- Mongoose

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MongoDB Compass
- Postman

## 4. Main Modules

### 4.1 User Authentication Management
Provides user registration and login functionality to access the system.

### 4.2 Waste Collection Request Management
Allows users to submit and manage waste collection requests with relevant waste details and collection locations.

### 4.3 Collection Scheduling and Route Management
Supports the organization of waste collection schedules and collection route information.

### 4.4 Collector Management
Supports the management of waste collection personnel and related collector information.

### 4.5 Complaint and Recycling Management
Provides facilities for managing user complaints and recycling-related information.

## 5. Main Features

- User registration and login.
- Waste collection request submission.
- Waste collection request management.
- Collection schedule management.
- Collector management.
- Location display using Google Maps API.
- Complaint management.
- Recycling information management.
- Dashboard with system statistics.

## 6. Project Structure

```text
EcoTrack/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## 7. Prerequisites

Make sure the following software is installed:

- Node.js
- npm (Node Package Manager)
- MongoDB
- Visual Studio Code (Recommended)

## 8. Installation and Setup

Follow the steps below to run the EcoTrack application locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/vihagi-2003/EcoTrack.git
```

### Step 2: Open the Project Folder

```bash
cd EcoTrack
```

### Step 3: Backend Setup

Open a terminal and execute:

```bash
cd backend
npm install
npm run seed
npm start
```

The backend server runs on:

http://localhost:5000

### Step 4: Frontend Setup

Open a new terminal and execute:

```bash
cd EcoTrack/client
npm install
npm run dev
```

The frontend application runs on:

http://localhost:5173

## 9. Database Configuration

EcoTrack uses MongoDB as its database and Mongoose for database connectivity and data management.

Example MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/EcoTrack
```

Make sure MongoDB is running before starting the backend server.

## 10. Environment Configuration

Create the required `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/EcoTrack
JWT_SECRET=your_secret_key
```

If Google Maps API integration is enabled, configure the frontend environment variable in the client folder:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Use your own valid configuration values. Do not upload private passwords or API secrets to GitHub.

## 11. Application URLs

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| MongoDB | mongodb://127.0.0.1:27017/EcoTrack |

## 12. Future Improvements

- Email and SMS notifications.
- Advanced waste collection route optimization.
- Improved reports and analytics.
- Additional recycling statistics.
- Enhanced mobile responsiveness.
- Real-time collection status updates.

## 13. GitHub Repository

Repository: https://github.com/vihagi-2003/EcoTrack

## 14. Author

Developed as an academic project in Information and Communication Technology.

**Project Name:** EcoTrack – Smart Waste Collection Management System

**University:** South Eastern University of Sri Lanka