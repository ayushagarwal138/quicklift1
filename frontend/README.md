# 🚗 Taxi Booking Frontend

A modern React-based taxi booking application with a beautiful UI built using Tailwind CSS.

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **Context API** - State management

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                 # API functions and axios configuration
│   │   ├── axios.js        # Axios instance with interceptors
│   │   ├── auth.js         # Authentication API calls
│   │   └── trips.js        # Trip-related API calls
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation header
│   │   └── ProtectedRoute.jsx # Route protection component
│   ├── context/            # React Context for state management
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Register.jsx    # Registration page
│   │   ├── BookRide.jsx    # Ride booking page
│   │   └── TripHistory.jsx # Trip history page
│   ├── App.jsx             # Main app component
│   └── index.css           # Global styles with Tailwind
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📋 Features

### Authentication
- ✅ Secure login and registration forms
- ✅ JWT token management
- ✅ Protected routes for authenticated users
- ✅ Automatic token refresh and logout on expiration
- ✅ Form validation and error handling

### Ride Booking
- ✅ Multiple vehicle type selection (Sedan, SUV, Luxury, Bike, Mini Van)
- ✅ Real-time fare estimation
- ✅ Pickup and destination location input
- ✅ Additional notes for drivers
- ✅ Booking confirmation and status tracking
- ✅ Trip summary display

### Trip History
- ✅ Complete trip history with status indicators
- ✅ Trip details including driver information
- ✅ Real-time status updates
- ✅ Responsive design for all screen sizes
- ✅ Trip filtering and search

### User Interface
- ✅ Modern, clean design with Tailwind CSS
- ✅ Responsive layout for all devices
- ✅ Loading states and error handling
- ✅ Intuitive navigation and user experience
- ✅ Mobile-friendly design

## 🔗 API Integration

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

## 🎨 UI Components

### Header Component
- Responsive navigation menu
- User authentication status
- Mobile-friendly hamburger menu
- Dynamic navigation based on user role

### Authentication Forms
- Login form with email/password
- Registration form with validation
- Password visibility toggle
- Error message display
- Loading states

### Ride Booking Interface
- Location input fields
- Vehicle type selection with icons
- Real-time fare calculation
- Trip summary display
- Booking confirmation

### Trip History
- Trip cards with status indicators
- Trip details and driver information
- Status badges and icons
- Responsive grid layout

## 🔧 Development

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

### State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication state
- **Global state**: JWT tokens, user information
- **Local state**: Form data, UI states

## 🎯 Key Features in Detail

### Vehicle Selection
- **Sedan** 🚗 - Standard vehicle, $15 base fare
- **SUV** 🚙 - Larger vehicle, $20 base fare
- **Luxury** 🏎️ - Premium vehicle, $25 base fare
- **Bike** 🏍️ - Motorcycle, $5 base fare
- **Mini Van** 🚐 - Group transport, $18 base fare

### Trip Status Tracking
- **REQUESTED** - Trip has been booked
- **ACCEPTED** - Driver has accepted the trip
- **IN_PROGRESS** - Trip is currently ongoing
- **COMPLETED** - Trip has been completed
- **CANCELLED** - Trip was cancelled

### Responsive Design
- **Desktop**: Full navigation menu, side-by-side layouts
- **Tablet**: Collapsible navigation, optimized spacing
- **Mobile**: Hamburger menu, stacked layouts, touch-friendly

## 🔒 Security Features

### JWT Token Management
- Automatic token inclusion in API requests
- Token expiration handling
- Secure token storage in localStorage
- Automatic logout on token expiration

### Protected Routes
- Authentication-based route protection
- Redirect to login for unauthenticated users
- Role-based access control (future enhancement)

### Form Validation
- Client-side validation for all forms
- Real-time error feedback
- Password strength requirements
- Email format validation

## 🚀 Deployment

The application can be deployed to any static hosting service:

### Build Process
1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your hosting service

3. **Configure your hosting service** to serve the `index.html` file for all routes

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Popular Deployment Options

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload to S3 bucket
- **Firebase Hosting**: `firebase deploy`

## 🧪 Testing

### Manual Testing
1. **Register a new account**
2. **Login with credentials**
3. **Book a ride** with different vehicle types
4. **View trip history**
5. **Test responsive design** on different devices

### Browser Testing
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Device Testing
- Desktop (1920x1080, 1366x768)
- Tablet (768x1024)
- Mobile (375x667, 414x896)

## 🔧 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors, fonts, and spacing
- Add custom CSS in `src/index.css`

### API Configuration
- Update API base URL in `src/api/axios.js`
- Modify endpoint paths as needed
- Add new API functions in respective files

### Components
- Add new components in `src/components/`
- Create new pages in `src/pages/`
- Update routing in `src/App.jsx`

## 📱 Performance

### Optimization Features
- **Code splitting** with React Router
- **Lazy loading** for better initial load time
- **Optimized images** and assets
- **Minified production build**
- **Efficient state management**

### Best Practices
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size
- Use appropriate image formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow React best practices
- Use TypeScript for better type safety (future enhancement)
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Open an issue in the repository
- Check the documentation
- Review the code examples

---

**Frontend Development Guide** 🎨 