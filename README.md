# QuickLift Backend & Frontend

## Overview
QuickLift is a modern ride-sharing platform featuring real-time driver matching, trip management, secure payments, and comprehensive dashboards for users, drivers, and administrators. The project consists of a Spring Boot backend and a React frontend, designed for scalability and ease of use.

## Features

- **User Dashboard**: Book rides, track trips, view trip history, and make payments (Card, UPI, or Cash).
- **Driver Dashboard**: 
  - Side panel for quick section switching (Dashboard, Active Trip, Trip History, Profile).
  - Header links for direct navigation to Pending Requests, Trip History, and Total Earnings detail pages.
  - Dashboard summary shows earnings, rating, pending requests count, and a preview of the active trip.
  - Accept/Reject ride requests with real-time updates.
  - Active Trip section and dashboard both show full trip details and actions.
- **Payment Flow**:
  - Users can pay via Card, UPI, or Cash.
  - For cash, a 'Payment Done' button marks the trip as paid, shows a toast, and redirects to the user dashboard.
  - For Card/UPI, payment is simulated and user is redirected after success.
- **Admin Dashboard**: Manage users, drivers, and trips with advanced analytics and controls.
- **Authentication**: Secure JWT-based login for users, drivers, and admins.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons for a seamless user experience.

## Getting Started

### Backend Setup
1. **Requirements:** Java 21 and Maven.
2. **Database:** By default, the backend uses an in-memory H2 database for development and testing. To use MySQL or another database, update `backend/src/main/resources/application.properties` accordingly.
3. **Run the Backend:**
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```
   The API will be available at [http://localhost:8080](http://localhost:8080).
4. **Testing:**
   To run backend tests:
   ```sh
   ./mvnw test
   ```

### Frontend Setup
1. **Requirements:** Node.js 16+ and npm.
2. **Environment Variables:**
   - Create a `.env` file in the `frontend/` directory with the following (adjust as needed):
     ```env
     VITE_API_BASE_URL=http://localhost:8080
     VITE_WS_BASE_URL=ws://localhost:8080/ws
     ```
3. **Install Dependencies:**
   ```sh
   cd frontend
   npm install
   ```
4. **Run the Frontend:**
   ```sh
   npm run dev
   ```
5. **Access the App:** [http://localhost:5173](http://localhost:5173)

## Usage
- **User:** Register, log in, book rides, select payment method, and pay after trip completion.
- **Driver:** Log in, go online, view and accept/reject pending requests, manage active trips, and view earnings/history.
- **Admin:** Manage all users, drivers, and trips with full control and analytics.

## Project Structure
- `backend/` - Spring Boot backend (REST API, WebSocket, JWT, DB models)
- `frontend/` - React frontend (pages, components, context, API)

## Recent Updates
- Complete rebranding to QuickLift (package names, documentation, and configuration).
- Enhanced driver dashboard with side panel and header navigation.
- Improved payment flow supporting cash, card, and UPI.
- New pages for driver pending requests, trip history, and earnings.

---
For more details, see the code comments and each directory's README.

