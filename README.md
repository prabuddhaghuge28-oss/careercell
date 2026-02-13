# CareerCell - College Placement Management System

CareerCell is a comprehensive full-stack web application designed to streamline the placement process for educational institutions. It facilitates seamless communication and management between Students, Training & Placement Officers (TPOs), Management, and Companies.

## 🚀 Features

- **Role-Based Access Control**: Secure login and distinct dashboards for Students, TPOs, Management, and Companies.
- **Student Portal**:
  - View and apply for placement drives.
  - Manage student profile and resume.
  - Access placement notices and results.
- **TPO Portal**:
  - Manage placement drives and job postings.
  - Post notices for students.
  - Track student applications and placement status.
- **Management Dashboard**:
  - Oversee the entire placement process.
  - Access analytics and reports (implied).
- **Notices & Announcements**: Centralized system for broadcasting updates.
- **Secure Authentication**: Robust JWT-based authentication for all user roles.
- **File Management**: Upload and manage resumes, offer letters, and profile images.

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: React.js (v18) with Vite
- **Styling**: Tailwind CSS, Bootstrap 5, React Bootstrap
- **Routing**: React Router DOM (v7)
- **State Management**: Context API (implied from structure)
- **HTTP Client**: Axios
- **Text Editor**: Jodit React (for rich text editing)

### Server (Backend)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Bcrypt
- **File Uploads**: Multer
- **Environment Management**: Dotenv

## 📂 Project Structure

The project is organized into two main directories:

- **client/**: Contains the React frontend application.
- **server/**: Contains the Express backend API and database logic.

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (Local or Atlas connection string)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd careercell
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
# For development (uses nodemon)
npm run dev

# For production
npm start
```
The server will start on `http://localhost:8080`.

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```
*Note: Ensure the port matches your backend server port.*

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173` (or the port shown in your terminal).

## 🛡️ License

This project is licensed under the ISC License.
