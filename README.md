# Taxi Booking System

A full-stack taxi booking application built with React (Frontend) and Spring Boot (Backend).

## 🚀 Features

### User Features
- **User Registration & Authentication**: Secure JWT-based authentication
- **Book Rides**: Easy ride booking with pickup and destination locations
- **Trip History**: View all past and current trips
- **Real-time Tracking**: Track your ride status in real-time
- **Rating System**: Rate and review your trips
- **Multiple Vehicle Types**: Choose from Sedan, SUV, Luxury, Motorcycle, or Van

### Driver Features
- **Driver Registration**: Register as a driver with vehicle details
- **Trip Management**: Accept, start, and complete trips
- **Status Management**: Update availability status
- **Earnings Tracking**: Track trip earnings and ratings

### Admin Features
- **User Management**: Manage all users and drivers
- **Trip Monitoring**: Monitor all active and completed trips
- **System Analytics**: View system statistics and reports

## 🛠️ Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security** with JWT
- **Spring Data JPA**
- **H2 Database** (Development)
- **Maven**

### Frontend
- **React 18**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **React Router** (Routing)
- **Axios** (HTTP client)
- **Lucide React** (Icons)

## 📁 Project Structure

```
taxi-booking-system/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rideshare/backend/
│   │   │   │   ├── config/         # Security & CORS config
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── model/         # JPA entities
│   │   │   │   ├── repository/    # Data access layer
│   │   │   │   ├── service/       # Business logic
│   │   │   │   └── util/          # JWT utilities
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
├── README.md
└── SETUP_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run the Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

3. **Backend will be available at**: `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Frontend will be available at**: `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate JWT token

### User Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{id}` - Get user by ID

### Trip Endpoints
- `POST /api/trips/book` - Book a new trip
- `GET /api/trips/my-trips` - Get user's trips
- `GET /api/trips/{id}` - Get trip by ID
- `POST /api/trips/{id}/cancel` - Cancel trip
- `POST /api/trips/{id}/rate` - Rate a completed trip

### Driver Endpoints
- `GET /api/drivers/available` - Get available drivers
- `POST /api/drivers/{tripId}/accept` - Accept a trip
- `POST /api/drivers/{tripId}/start` - Start a trip
- `POST /api/drivers/{tripId}/complete` - Complete a trip

## 🔐 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Configured for React frontend
- **Input Validation**: Comprehensive request validation

## 🗄️ Database

- **H2 Database**: In-memory database for development
- **JPA/Hibernate**: Object-relational mapping
- **Automatic Schema**: Tables created automatically on startup

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean and intuitive interface
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side and server-side validation

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📦 Building for Production

### Backend
```bash
cd backend
./mvnw clean package
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in each directory
- Review the SETUP_GUIDE.md for detailed setup instructions
- Open an issue on GitHub

## 🔄 Version History

- **v1.0.0**: Initial release with basic taxi booking functionality
- JWT authentication
- User registration and login
- Trip booking and management
- Driver management system
- Modern React frontend with Tailwind CSS

---

**Happy Coding! 🚗✨**

