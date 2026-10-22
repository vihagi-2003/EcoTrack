# EcoTrack – Smart Waste Collection Management System

## 1. Project Overview

EcoTrack is a full-stack web application developed to improve waste collection management. The system helps users submit waste collection requests, view collection schedules, manage complaints, and access recycling-related information.

The main goal of EcoTrack is to make waste collection more efficient, organized, and environmentally friendly.

## 2. Project Objectives

- Simplify the waste collection request process.
- Manage waste collection requests efficiently.
- Provide collection schedule information.
- Allow users to submit and manage complaints.
- Support recycling management.
- Provide a user-friendly interface for waste management activities.

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
- REST API

### Database
- MongoDB
- Mongoose

### Development Tools
- Visual Studio Code
- Git and GitHub
- MongoDB Compass

## 4. Main Features

- User registration and login
- Waste collection request management
- Collection schedule management
- Location display using Google Maps
- Complaint management
- Recycling information management
- Dashboard with system statistics

## 5. Project Structure

```text
EcoTrack/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
├── client/
│   ├── src/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## 6. Prerequisites

Install the following software before running the project:

- Node.js and npm
- MongoDB
- Visual Studio Code (recommended)

## 7. Installation and Setup

### Run Backend

Open a terminal in the project folder and execute:

```bash
cd EcoTrack/backend
npm install
npm run seed
npm start
```

### Run Frontend (New Terminal)

Open a second terminal and execute:

```bash
cd EcoTrack/client
npm install
npm run dev
```

## 8. Application URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **MongoDB:** mongodb://127.0.0.1:27017/EcoTrack

## 9. Demo Login

- **Email:** admin@ecotrack.com
- **Password:** 123456

*Note: Use these demo credentials only if the account is configured in the application and the login has been tested successfully.*

## 10. Environment Configuration

Configure the required environment variables in the appropriate `.env` files before starting the application.

Example MongoDB connection string:

```env
MONGO_URI=mongodb://127.0.0.1:27017/EcoTrack
```

If the application uses a JWT secret or Google Maps API key, configure those values according to the project code.

**Important:** Do not commit real passwords, private API keys, or other secrets to GitHub.

## 11. Future Improvements

- Email and SMS notifications
- Improved waste collection route planning
- Advanced reports and analytics
- Additional recycling statistics
- Improved mobile responsiveness

## 12. GitHub Repository

https://github.com/vihagi-2003/EcoTrack-Smart-Waste-Collection-

## 13. Author

Developed as an Information and Communication Technology academic project.
