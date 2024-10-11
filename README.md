# Invoice Generator Web App

This project is an intuitive and easy-to-use invoice generation web application, which allows users to create, manage, and track their invoices. The platform includes a landing page, user authentication with JWT tokens, and features for managing and viewing invoice history.

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features
- **Landing Page**: Clean and simple landing page where users can learn about the service and sign up (See Screenshot 1).
- **User Authentication**: Secure login and registration using JWT (JSON Web Tokens) and PostgreSQL for data persistence.
- **Invoice Creation**: Form to input customer details, items, and pricing, which generates professional invoices in seconds (See Screenshot 2 & 3).
- **Invoice History**: Users can view and track all previously generated invoices (See Screenshot 4).

---

## Screenshots

### 1. Landing Page
![Landing Page](./mnt/data/Landing-Page.png)

### 2. Invoice Creation Form (Part 1)
![Invoice Form 1](./mnt/data/Invoice-form.png)

### 3. Invoice History
![Invoice History](./mnt/data/Invoice-History.png)


---

## Technologies Used
- **Frontend (Client)**: React.js
- **Backend (Server)**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Version Control**: Git
- **Package Manager**: NPM

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your local machine.
- [PostgreSQL](https://www.postgresql.org/) installed and configured.
- Ensure you have `npm` or `yarn` package manager installed.

### Step 1: Clone the repository

```bash
git clone https://github.com/your-username/invoice-generator.git
cd invoice-generator
```

### Step 2: Install dependencies for both Client and Server

#### For Client:

```bash
cd client
npm install
```
#### For Server:
```bash
cd ../server
npm install
```
### Step 3: Setup Environment Variables

Create a .env file in the server folder and configure the following variables:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgres_database_url
```
## Running the Application

### Step 1: Start the Backend (Server)
Make sure you're in the server folder and run:

```bash
nodemon index.js
```
This will start the backend server on http://localhost:5000.

### Step 2: Start the Frontend (Client)
In a new terminal window, navigate to the client folder and run:

```bash
cd client
npm start
```
This will start the React frontend on http://localhost:3000.

## API Endpoints

The server provides several RESTful endpoints for handling authentication, user management, and invoice creation.

### Authentication

- **POST** `/` - Register a new user.
  - Request body should include: `Name`, `email`, `password`, `type` (account type).
  - On success, it returns a JWT token and a success message.

- **POST** `/loginuser` - Log in a user and return a JWT token.
  - Request body should include: `email`, `password`.
  - On success, it returns a JWT token and `userID`.

- **POST** `/verify` - Verify a user's JWT token.
  - Requires `token` in the request header.
  - Returns `true` if token is valid.

### Invoices

- **POST** `/saveinvoice` - Upload an invoice for a user.
  - Requires `Invoice` file and `userID` in the request body.
  - Saves the file to AWS S3 and records the file in the database.

- **GET** `/invoices` - Get a list of all invoices for a user.
  - Requires `userID` in the query string.
  - Returns an array of invoices with their signed URLs for download.

---


