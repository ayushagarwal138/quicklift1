# 🚀 Taxi Booking System - Complete Setup Guide

This guide will help you set up and run the complete taxi booking system with both backend and frontend.

## 📁 Project Structure

```
taxi-booking-system/
├── backend/                 # Spring Boot Backend
│   ├── src/                # Java source code
│   ├── pom.xml             # Maven dependencies
│   └── README.md           # Backend documentation
├── frontend/               # React Frontend
│   ├── src/                # React source code
│   ├── package.json        # Node.js dependencies
│   └── README.md           # Frontend documentation
├── README.md               # Main project documentation
└── SETUP_GUIDE.md          # This setup guide
```

## 🛠️ Prerequisites

### Backend Requirements
- **Java 21** (or higher)
- **Maven** (included with the project)

### Frontend Requirements
- **Node.js 16+** (or higher)
- **npm** (comes with Node.js)

### Verify Installation
```bash
# Check Java version
java -version

# Check Node.js version
node --version

# Check npm version
npm --version
```

## 🚀 Quick Setup

### Step 1: Clone and Navigate
```bash
# Navigate to the project directory
cd taxi-booking-system
```

### Step 2: Start the Backend
```bash
# Navigate to backend directory
cd backend

# Start Spring Boot application
./mvnw spring-boot:run
```

**Backend will be available at:** `http://localhost:8080`

### Step 3: Start the Frontend (New Terminal)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

## 🧪 Testing the Application

### 1. Access the Application
- Open your browser and go to: `http://localhost:5173`
- You should see the TaxiBook landing page

### 2. Register a New Account
- Click "Get Started" or "Register"
- Fill in your details:
  - First Name: `John`
  - Last Name: `Doe`
  - Email: `john@example.com`
  - Phone: `+1234567890`
  - Password: `password123`
  - Role: `Passenger`
- Click "Create account"

### 3. Login
- Use your registered email and password
- You should be redirected to the home page

### 4. Book a Ride
- Click "Book Ride" in the navigation
- Fill in the trip details:
  - Pickup Location: `123 Main Street`
  - Destination: `456 Oak Avenue`
  - Vehicle Type: Select any vehicle
  - Notes: `Please arrive on time`
- Click "Book Ride Now"

### 5. View Trip History
- Click "Trip History" in the navigation
- You should see your booked trip

## 🔧 Development Workflow

### Backend Development
```bash
cd backend

# Run with hot reload
./mvnw spring-boot:run

# Build the project
./mvnw clean package

# Run tests
./mvnw test
```

### Frontend Development
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 API Testing

### Using H2 Console
1. Go to: `http://localhost:8080/h2-console`
2. Use these settings:
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)
3. Click "Connect"

### Using cURL
```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+1234567890",
    "role": "PASSENGER"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔍 Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

**Java version issues:**
```bash
# Check Java version
java -version

# Install Java 21 if needed
# macOS: brew install openjdk@21
# Ubuntu: sudo apt install openjdk-21-jdk
```

### Frontend Issues

**Port 5173 already in use:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

**Node modules issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build issues:**
```bash
# Clear build cache
npm run build -- --force
```

## 🚀 Production Deployment

### Backend Deployment
1. **Build the JAR:**
   ```bash
   cd backend
   ./mvnw clean package
   ```

2. **Run the JAR:**
   ```bash
   java -jar target/rideshare-backend-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment
1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 📱 Features Overview

### ✅ Implemented Features
- **User Authentication**: Register, login, JWT tokens
- **Ride Booking**: Multiple vehicle types, fare estimation
- **Trip Management**: Status tracking, history
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Trip status changes
- **Security**: Protected routes, form validation

### 🚧 Future Enhancements
- **Real-time Tracking**: Live driver location
- **Payment Integration**: Stripe/PayPal
- **Push Notifications**: Trip updates
- **Driver App**: Separate driver interface
- **Admin Dashboard**: Trip management
- **Rating System**: Driver/passenger ratings

## 📞 Support

### Common Issues
1. **CORS errors**: Backend CORS is configured for `http://localhost:5173`
2. **JWT token issues**: Check token expiration and format
3. **Database issues**: H2 database is in-memory, data resets on restart

### Getting Help
- Check the individual README files in `backend/` and `frontend/`
- Review the API documentation
- Check browser console for frontend errors
- Check backend logs for server errors

## 🎉 Success!

Once both applications are running:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080`
- **H2 Database**: `http://localhost:8080/h2-console`

You now have a fully functional taxi booking system! 🚗✨

---

**Happy Coding! 🚀** 