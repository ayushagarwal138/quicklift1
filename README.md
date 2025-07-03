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
1. **Requirements:** Java 17+ and Maven.
2. **Database:** Configure MySQL and update `backend/src/main/resources/application.properties` as needed.
3. **Database Schema:**
   - Ensure your `trips` table includes:
     - `paid` (BOOLEAN, default FALSE)
     - `paymentMethod` (VARCHAR)
   - Example migration:
     ```sql
     ALTER TABLE trips ADD COLUMN paid BOOLEAN NOT NULL DEFAULT FALSE;
     ALTER TABLE trips ADD COLUMN paymentMethod VARCHAR(32);
     ```
4. **Run the Backend:**
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. **Requirements:** Node.js 18+ and npm.
2. **Install Dependencies:**
   ```sh
   cd frontend
   npm install
   ```
3. **Run the Frontend:**
   ```sh
   npm run dev
   ```
4. **Access the App:** [http://localhost:5173](http://localhost:5173)

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

