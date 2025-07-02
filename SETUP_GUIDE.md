# 🚖 Rideshare Booking System – Professional Setup Guide

Welcome! This guide will help you set up, run, and develop the Rideshare Booking System, including both backend (Spring Boot) and frontend (React).

---

## 📁 Project Structure

```
rideshare-backend-springboot/
├── backend/      # Spring Boot backend (Java)
├── frontend/     # React frontend (JS/TS)
├── README.md     # Project overview
├── SETUP_GUIDE.md# This setup guide
```

---

## 🛠️ Prerequisites

- **Java 21+**
- **Node.js 16+** and **npm**
- **Maven** (included via wrapper)

**Verify your tools:**
```bash
java -version
node --version
npm --version
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd rideshare-backend-springboot
```

### 2. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```
- Backend runs at: [http://localhost:8080](http://localhost:8080)

### 3. Start the Frontend (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs at: [http://localhost:5173](http://localhost:5173)

---

## 👤 Default Admin Login

- **Username:** `admin`
- **Password:** `password`

---

## 🧪 Testing the Application

1. Open [http://localhost:5173](http://localhost:5173) in your browser.
2. Register as a user, driver, or login as admin.
3. Book rides, view trip history, and explore dashboards.

---

## 🔧 Development Commands

### Backend
```bash
cd backend
./mvnw spring-boot:run      # Start with hot reload
./mvnw clean package        # Build JAR
./mvnw test                 # Run tests
```

### Frontend
```bash
cd frontend
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build
```

---

## 🛠️ Troubleshooting

### Common Issues

- **Port in use:**  
  Find and kill the process:
  ```bash
  lsof -i :8080   # or :5173
  kill -9 <PID>
  ```

- **Java/Node version:**  
  Ensure you have Java 21+ and Node.js 16+.

- **Node modules issues:**  
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- **CORS errors:**  
  Backend CORS is configured for `http://localhost:5173` and `http://localhost:3000`.

- **Database:**  
  H2 is in-memory; data resets on restart.  
  Access H2 console at [http://localhost:8080/h2-console](http://localhost:8080/h2-console).

---

## 📊 API & Database

- **API Docs:** See backend/README.md for endpoints.
- **H2 Console:**  
  - URL: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa` (no password)

---

## 🚀 Production Deployment

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/rideshare-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting provider
```

---

## 📱 Features Overview

- User, Driver, and Admin roles
- Authentication (JWT)
- Ride booking, trip management, fare estimation
- Real-time updates (WebSocket)
- Responsive design
- Admin dashboard

---

## 📞 Support

- Check backend/frontend README files
- Review API docs
- Check browser console and backend logs for errors

---

**Happy Coding! 🚀** 