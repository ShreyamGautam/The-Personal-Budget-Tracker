Of course. Here is a detailed and attractive README file for your project, written in Markdown. You can copy and paste this directly into a `README.md` file in your project's root directory.

-----

# Expense Tracker - A Full-Stack MERN Application

This is a comprehensive personal finance and budget tracking application designed to help users manage their income, expenses, and budgets effectively. Built from the ground up with the MERN stack, this application provides a clean, responsive user interface and a powerful, secure backend. It supports both individual financial tracking and collaborative group expense management.

## ✨ Features

We have built a rich set of features to provide a complete user experience:

### Core Personal Finance

  * **Transaction Management:** Full CRUD (Create, Read, Update, Delete) functionality for both income and expense entries.
**Dynamic Dashboard:** An at-a-glance view of your complete financial status, including total balance, income, expenses, recent transactions, and visual charts. 
**Budget Management:** Set monthly budgets for different categories, track your spending with real-time progress bars, and get visual alerts when you overspend. 
  * **Data Visualization:** Interactive and dynamic charts on every page.
      * **Bar charts** to show monthly income trends.
      * **Line charts** to show monthly expense trends. 
      * **Donut charts** for a financial overview and category-wise breakdowns. 
  * **Advanced Filtering & Search:** Easily find transactions with a real-time search bar and advanced filters for categories and date ranges. 
  * **PDF Reports:** Download your income or expense history as a formatted PDF document.

### User & Group Management

  * **Secure User Authentication:** Complete user registration and login system using JWT for security.  Pages are protected, and data is private to each user.
  * **Personalized Profile:** Users can upload and update their own profile pictures, and their name is displayed throughout the app.
  * **Group Expense Management (Splitwise Clone):**
      * Create groups for shared activities (e.g., trips, roommates).
      * Add or remove members from groups.
      * Add shared expenses and split them equally or unequally .

## 🛠️ Tech Stack

  * **Frontend:**
      * **React.js:** For building a fast, component-based user interface.
      * **React Router:** For client-side routing and navigation.
      * **Axios:** For making API calls to the backend.
      * **Chart.js:** For creating beautiful and dynamic charts.
      * **jsPDF & jspdf-autotable:** For generating PDF reports.
      * **React Hot Toast:** for user-friendly notifications.
  * **Backend:**
      * **Node.js & Express.js:** For building a robust and scalable server.
      * **MongoDB:** As the NoSQL database for storing all application data.
      * **Mongoose:** As the Object Data Modeling (ODM) library to interact with MongoDB.
  * **Authentication & Security:**
      * **JSON Web Tokens (JWT):** For securing API endpoints and managing user sessions.
      * **bcrypt.js:** For hashing passwords before storing them in the database.
  * **File Handling:**
      * **Multer:** Middleware for handling `multipart/form-data`, used for file uploads.

## 🚀 Getting Started

### Prerequisites

  * Node.js and npm installed
  * MongoDB Atlas account (or a local MongoDB instance)
  * Git

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd expense-tracker-app
    ```

2.  **Setup the Backend:**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory and add the following variables:

    ```
    MONGO_URL=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    ```

3.  **Setup the Frontend:**

    ```bash
    cd frontend
    npm install
    ```

### Running the Application

1.  **Run the Backend Server:**

      * Navigate to the `backend` directory and run:
        ```bash
        npm start
        ```
      * The server will start on `http://localhost:5000`.

2.  **Run the Frontend Application:**

      * In a new terminal, navigate to the `frontend` directory and run:
        ```bash
        npm start
        ```
      * The React application will open in your browser at `http://localhost:3000`.

## 📸 Screenshots

Here are a few glimpses of the application:

**Login Page**

**Main Dashboard**

**Income Page with Filters**

**Group Details Page**

-----

This project was a great journey in learning and implementing a full-stack MERN application.
