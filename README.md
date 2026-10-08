# TopUpNG Backend API

A modern, scalable backend API for airtime and data top-up services built with Node.js, Express, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Authentication & Security
- ✅ User registration and login with JWT
- ✅ Password hashing with bcryptjs
- ✅ Refresh token management
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Login history tracking
- ✅ Session management

### Transactions
- ✅ Airtime purchase
- ✅ Data bundle purchase
- ✅ Transaction history
- ✅ Real-time transaction status
- ✅ Automatic cashback calculation (5%)

### Payment Processing
- ✅ Multiple payment methods (Debit Card, Bank Transfer)
- ✅ Payment method management
- ✅ Secure card storage
- ✅ Payment history

### User Management
- ✅ User profile management
- ✅ Wallet balance tracking
- ✅ Transaction PIN management
- ✅ Notification preferences
- ✅ Login activity tracking

### Network Support
- ✅ MTN
- ✅ Airtel
- ✅ Glo
- ✅ 9mobile

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** PostgreSQL (v12+)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** Custom validators
- **Logging:** Morgan + Custom logger
- **Security:** Helmet, CORS, Rate Limiting

### Development
- **Package Manager:** npm
- **Code Quality:** ESLint (optional)
- **Testing:** Jest
- **Auto-reload:** Nodemon
- **Environment:** dotenv

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required
- **Node.js** (v14.0.0 or higher)
```bash
  # Check version
  node --version
```

- **npm** (v6.0.0 or higher)
```bash
  # Check version
  npm --version
```

- **PostgreSQL** (v12 or higher)
```bash
  # Check version
  psql --version
```

### Optional
- **Git** (for version control)
- **Postman** (for API testing)
- **VS Code** (or any code editor)

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/topupng-backend.git
cd topupng-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- pg (PostgreSQL driver)
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- And other dependencies listed in package.json

### Step 3: Verify Installation

```bash
npm list
```

---

## ⚙️ Configuration

### Step 1: Create .env File

Copy the example .env file and update with your values:

```bash
# Option 1: Interactive setup
npm run setup

# Option 2: Automatic setup
npm run auto-setup

# Option 3: Manual setup
cp .env.example .env
# Then edit .env with your values
```

### Step 2: Configure Environment Variables

Edit `backend/.env`:

```env
# DATABASE
DATABASE_URL=postgresql://topupng_user:your_password@localhost:5432/topupng_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=topupng_user
DB_PASSWORD=your_secure_password
DB_NAME=topupng_db

# SERVER
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d

# FRONTEND
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# EMAIL (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_ENABLED=false

# PAYMENT GATEWAYS (Optional)
PAYSTACK_SECRET_KEY=your_paystack_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Generate Secure Secrets

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Refresh Secret (different from JWT)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE topupng_db;

# Create user
CREATE USER topupng_user WITH PASSWORD 'your_secure_password';

# Grant privileges
ALTER ROLE topupng_user SET client_encoding TO 'utf8';
ALTER ROLE topupng_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE topupng_db TO topupng_user;

# Exit
\q
```

### Step 2: Load Database Schema

```bash
# Load authentication schema
psql -U topupng_user -d topupng_db -f database/auth-schema.sql

# Load main schema
psql -U topupng_user -d topupng_db -f database/schema.sql

# Load seed data
psql -U topupng_user -d topupng_db -f database/seed.sql
```

### Step 3: Verify Database

```bash
# Connect to database
psql -U topupng_user -d topupng_db

# List tables
\dt

# Exit
\q
```

---

## ▶️ Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

This will:
- Start the server with Nodemon
- Auto-reload on file changes
- Show detailed logging

### Production Mode

```bash
npm start
```

### Check Server Status

```bash
# In another terminal
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2026-10-08T10:30:45.123Z",
  "environment": "development",
  "uptime": 5.234
}
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Sarah Adebayo",
  "email": "sarah@domain.com",
  "phoneNumber": "0802345678",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

Response:
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "fullName": "Sarah Adebayo",
    "email": "sarah@domain.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "550e8400-e29b-41d4-a716..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "sarah@domain.com",
  "password": "SecurePassword123!"
}
```

#### Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "fullName": "Sarah Adebayo",
  "dateOfBirth": "1995-09-14"
}
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716..."
}
```

### Airtime Endpoints

#### Buy Airtime (Protected)
```http
POST /api/airtime/buy
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "phoneNumber": "0802345678",
  "network": "MTN",
  "amount": 1000
}
```

#### Get Airtime Plans
```http
GET /api/airtime/plans
```

### Data Endpoints

#### Buy Data (Protected)
```http
POST /api/data/buy
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "phoneNumber": "0802345678",
  "network": "MTN",
  "planId": "2gb"
}
```

#### Get Data Plans
```http
GET /api/data/plans
```

### Transaction Endpoints

#### Get Transaction History (Protected)
```http
GET /api/transactions/history
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Query Parameters:
- `type`: 'airtime' or 'data'
- `limit`: number of records (default: 20)
- `offset`: pagination offset (default: 0)

---

## 📁 Project Structure