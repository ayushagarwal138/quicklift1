import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookRide from './pages/BookRide';
import TripTracking from './pages/TripTracking';
import TripHistory from './pages/TripHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ConfirmBooking from './pages/ConfirmBooking';
import SelectDriver from './pages/SelectDriver';
import UserDashboard from './pages/UserDashboard';
import WaitingForDriver from './pages/WaitingForDriver';
import Payment from './pages/Payment';
import DriverPendingRequests from './pages/DriverPendingRequests';
import DriverHistory from './pages/DriverHistory';
import DriverEarnings from './pages/DriverEarnings';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/book"
                  element={
                    <ProtectedRoute>
                      <BookRide />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/driver/dashboard"
                  element={
                    <ProtectedRoute roles={['DRIVER']}>
                      <DriverDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:tripId"
                  element={
                    <ProtectedRoute>
                      <TripTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trips/:tripId/confirm"
                  element={
                    <ProtectedRoute>
                      <ConfirmBooking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <TripHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/select-driver/:tripId"
                  element={
                    <ProtectedRoute>
                      <SelectDriver />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/dashboard"
                  element={
                    <ProtectedRoute roles={['USER']}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/waiting-for-driver/:tripId"
                  element={
                    <ProtectedRoute>
                      <WaitingForDriver />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/:tripId"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route path="/driver/pending-requests" element={<DriverPendingRequests />} />
                <Route path="/driver/history" element={<DriverHistory />} />
                <Route path="/driver/earnings" element={<DriverEarnings />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 