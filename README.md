# 🚖 QuickLift - Full Stack Ride Sharing Platform

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

> A scalable, real-time ride-sharing application built with a **Microservices-ready architecture** using **Spring Boot** and **React**.

## 📖 Overview
QuickLift is a comprehensive mobility solution designed to simulate real-world ride-hailing scenarios. It features distinct interfaces for **Riders, Drivers, and Administrators**, utilizing **JWT authentication** for security and **WebSockets** for real-time ride status updates.

The project demonstrates proficiency in building **RESTful APIs**, handling **complex state management** on the frontend, and managing relational data with **Hibernate/JPA**.

---

## 📸 Screenshots
| User Dashboard | Driver Dashboard |
|:---:|:---:|
| <img src="https://drive.google.com/uc?export=view&id=1lhiv4VkBRkFMNSwz4bK6GR3QBkTEckmA" alt="User Dashboard" width="400"/> | <img src="https://drive.google.com/uc?export=view&id=1C7Hu3LL-2HSPpy3tM2Pdc024DqHyWA2r" alt="Driver Dashboard" width="400"/> |

| Pofile Settings | Admin Analytics |
|:---:|:---:|
| <img src="https://drive.google.com/thumbnail?id=1GcJfjQTjlSVmLA5PI2vOf9sMYhzn6DSp&sz=w1000" alt="Payment" width="400"/> | <img src="https://drive.google.com/thumbnail?id=1L4D9QZwl4ITRSL9VViumvVO-C1LAF6AE&sz=w1000" alt="Admin" width="400"/> |

---

## 🛠️ Tech Stack

### Backend (Java Ecosystem)
* **Framework:** Spring Boot 3.x
* **Language:** Java 21
* **Database:** PostgreSQL via Spring Data JPA
* **Security:** Spring Security + JWT (Stateless Authentication)
* **Real-time:** WebSocket (STOMP) for driver-user pairing
* **Build Tool:** Maven

### Frontend (Client Side)
* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS + Lucide Icons
* **State Management:** Context API (simulating Redux patterns)
* **HTTP Client:** Axios

---

## 🚀 Key Features

### 👤 For Users (Riders)
* **Real-time Booking:** Instant ride requests broadcasted to nearby drivers using WebSockets.
* **Flexible Payments:** Supports simulated Card, UPI, and Cash workflows.
* **Trip History:** Persistent storage of past rides with fare breakdowns and status tracking.

### 🚗 For Drivers
* **Interactive Dashboard:** A "Hot-switch" side panel to toggle between Active Trips, Requests, and Earnings.
* **Request Management:** Real-time Accept/Reject functionality with optimistic UI updates.
* **Earnings Tracker:** Visualized summary of daily and total revenue.

### 🛡️ For Admins
* **User Management:** Full CRUD capabilities for Users and Drivers.
* **System Health:** Analytics on total trips, active users, and platform revenue.

---

## ⚡ Getting Started

### Prerequisites
* **Java:** JDK 21+
* **Node.js:** v16+
* **Database:** PostgreSQL (Ensure service is running)

### 1. Backend Setup
The backend runs on port `8080` by default.

1. **Configure Database:**
   
   Update `src/main/resources/application.properties` with your credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/quicklift_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password

2. **Run Application (Backend)**

   ```bash
    cd backend
    # Run using Maven Wrapper (No install needed)
    ./mvnw spring-boot:run
   
### 2. Frontend Setup
The frontend runs on port `5173` by default.

   ```bash
    cd frontend
    # Install dependencies
    npm install

    # Create environment file
    echo "VITE_API_BASE_URL=http://localhost:8080" > .env
    echo "VITE_WS_BASE_URL=ws://localhost:8080/ws" >> .env

    # Start the dev server
    npm run dev
```
---

## 📂 Project Structure

   ```bash
     quicklift/
├── backend/
│   ├── src/main/java/com/quicklift/
│   │   ├── config/       # Security (JWT) & WebSocket Config
│   │   ├── controller/   # REST Controllers & API Endpoints
│   │   ├── model/        # JPA Entities & DTOs
│   │   ├── service/      # Business Logic & Transaction Management
│   │   └── repository/   # Data Access Layer (Spring Data JPA)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI Components (Cards, Modals)
│   │   ├── pages/        # Dashboard Views & Route Pages
│   │   ├── context/      # AuthContext & SocketContext
│   │   └── assets/       # Images & Static Files
│   └── package.json
└── README.md
```
---
## 🔮 Future Improvements
* [ ] Integration with Google Maps API for live location tracking.

* [ ] Microservices decomposition (separate Auth, Trip, and Payment services).

* [ ] Docker support for containerized deployment (Dockerfile & Compose).

* [ ] JUnit 5 Testing coverage for critical business logic.
---
## 👨‍💻 Author

### Ayush Agarwal Java Full Stack Developer.
[LinkedIn](https://www.linkedin.com/in/ayush-agarwal-50668927b/) | [Portfolio](https://portfolio-alpha-puce-1o6qxo19x8.vercel.app/)
