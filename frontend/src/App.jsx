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
import BookingConfirmation from './pages/BookingConfirmation';
import TripTracking from './pages/TripTracking';
import TripHistory from './pages/TripHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CitySelectorTest from './components/CitySelectorTest';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test-cities" element={<CitySelectorTest />} />
                <Route
                  path="/book"
                  element={
                    <ProtectedRoute>
                      <BookRide />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmation"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/trip-tracking"
                  element={
                    <ProtectedRoute>
                      <TripTracking />
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
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 