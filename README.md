# Rideshare Backend & Frontend

## Features

- **User Dashboard**: Book rides, track trips, view trip history, and make payments (Card, UPI, or Cash).
- **Driver Dashboard**: 
  - Side panel for quick section switching (Dashboard, Active Trip, Trip History, Profile).
  - Header links for direct navigation to Pending Requests, Trip History, and Total Earnings detail pages.
  - Dashboard summary shows earnings, rating, pending requests count, and a preview of the active trip.
  - Pending Requests section always shows the latest request at the top.
  - Accept/Reject ride requests with real-time updates.
  - Active Trip section and dashboard both show full trip details and actions.
- **Payment Flow**:
  - Users can pay via Card, UPI, or Cash.
  - For cash, a 'Payment Done' button marks the trip as paid, shows a toast, and redirects to the user dashboard.
  - For Card/UPI, payment is simulated and user is redirected after success.
- **Admin Dashboard**: (if enabled) Manage users, drivers, and trips.
- **Authentication**: JWT-based login for users and drivers.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.

## Setup Instructions

### Backend
1. Install Java 17+ and Maven.
2. Configure your database (MySQL recommended). Update `backend/src/main/resources/application.properties` as needed.
3. Run database migrations (see below for schema changes).
4. Start the backend:
   ```sh
   cd backend
   ./mvnw spring-boot:run
   ```

#### Database Schema Notes
- Make sure your `trips` table includes:
  - `paid` (BOOLEAN, default FALSE)
  - `paymentMethod` (VARCHAR)
- Example migration:
  ```sql
  ALTER TABLE trips ADD COLUMN paid BOOLEAN NOT NULL DEFAULT FALSE;
  ALTER TABLE trips ADD COLUMN paymentMethod VARCHAR(32);
  ```

### Frontend
1. Install Node.js 18+ and npm.
2. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```
4. Access the app at [http://localhost:5173](http://localhost:5173)

## Usage
- **User**: Register, log in, book a ride, select payment method, and pay after trip completion.
- **Driver**: Log in, go online, view and accept/reject pending requests, manage active trips, and view earnings/history.
- **Admin**: (if enabled) Manage all users, drivers, and trips.

## Project Structure
- `backend/` - Spring Boot backend (REST API, WebSocket, JWT, DB models)
- `frontend/` - React frontend (pages, components, context, API)

## Recent Updates
- Driver dashboard now features both a side panel and header navigation.
- Pending requests are always sorted with the latest at the top.
- Payment flow supports cash, card, and UPI, with user-friendly feedback and redirects.
- New pages for driver pending requests, trip history, and earnings.

---
For more details, see the code comments and each directory's README.

