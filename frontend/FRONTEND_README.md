# TaxiBook Frontend

A modern React-based taxi booking application with a beautiful UI built using Tailwind CSS.

## Features

- 🚗 **User Authentication**: Secure login and registration with JWT tokens
- 📍 **Ride Booking**: Easy-to-use interface for booking rides with multiple vehicle types
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful and intuitive interface built with Tailwind CSS
- 📊 **Trip History**: View all your past and current trips
- 🔒 **Protected Routes**: Secure access to authenticated features
- ⚡ **Fast Performance**: Built with Vite for optimal development experience

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taxi-booking-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── api/                 # API functions and axios configuration
│   ├── axios.js        # Axios instance with interceptors
│   ├── auth.js         # Authentication API calls
│   └── trips.js        # Trip-related API calls
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   └── ProtectedRoute.jsx # Route protection component
├── context/            # React Context for state management
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── BookRide.jsx    # Ride booking page
│   └── TripHistory.jsx # Trip history page
├── App.jsx             # Main app component
└── index.css           # Global styles with Tailwind
```

## API Integration

The frontend integrates with the Spring Boot backend API:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT token-based authentication
- **CORS**: Configured for cross-origin requests

### Available Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /trip/book` - Book a new ride
- `GET /trip/history` - Get trip history
- `GET /user/profile` - Get user profile

## Features in Detail

### Authentication
- Secure login and registration forms
- JWT token management
- Protected routes for authenticated users
- Automatic token refresh and logout on expiration

### Ride Booking
- Multiple vehicle type selection (Sedan, SUV, Luxury, Bike, Mini Van)
- Real-time fare estimation
- Pickup and destination location input
- Additional notes for drivers
- Booking confirmation and status tracking

### Trip History
- Complete trip history with status indicators
- Trip details including driver information
- Real-time status updates
- Responsive design for all screen sizes

### User Interface
- Modern, clean design with Tailwind CSS
- Responsive layout for all devices
- Loading states and error handling
- Intuitive navigation and user experience

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for better UX

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting service
3. Configure your hosting service to serve the `index.html` file for all routes

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 