# 🚗 Taxi Booking Backend

A Spring Boot backend for the taxi booking system with JWT authentication, trip management, and RESTful APIs.

## 🛠️ Tech Stack

- **Java 21**
- **Spring Boot 3.4.4**
- **Spring Security** with JWT
- **Spring Data JPA** (Hibernate)
- **H2 Database** (in-memory)
- **Maven**

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/rideshare/backend/
│   │   │   ├── config/           # Security and CORS configuration
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Data access layer
│   │   │   ├── service/         # Business logic
│   │   │   └── util/            # JWT utilities
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## 🚀 Quick Start

### Prerequisites

- Java 21
- Maven

### Running the Application

1. **Start the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **The API will be available at:**
   - Base URL: `http://localhost:8080`
   - API Endpoints: `http://localhost:8080/api`

## 📋 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Role-based authorization (PASSENGER/DRIVER)
- ✅ Secure password handling

### Trip Management
- ✅ Trip booking with multiple vehicle types
- ✅ Trip status tracking (REQUESTED → ACCEPTED → IN_PROGRESS → COMPLETED)
- ✅ Driver assignment
- ✅ Trip history

### User Management
- ✅ User profile management
- ✅ Role-based user registration
- ✅ User data validation

### API Features
- ✅ RESTful API design
- ✅ CORS configuration for frontend
- ✅ Input validation
- ✅ Error handling
- ✅ JWT token management

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Trips
```
POST /api/trip/book
GET /api/trip/history
POST /api/trip/accept/{tripId}
POST /api/trip/complete/{tripId}
```

### User Management
```
GET /api/user/profile
PUT /api/user/update
```

## 🗄️ Database Schema

### User Entity
- `id` - Primary key
- `email` - Unique email address
- `password` - Encrypted password
- `firstName`, `lastName` - User names
- `phoneNumber` - Contact number
- `role` - PASSENGER or DRIVER
- `createdAt`, `updatedAt` - Timestamps

### Trip Entity
- `id` - Primary key
- `passenger` - User who booked the trip
- `driver` - Assigned driver (nullable)
- `pickupLocation` - Pickup address
- `destinationLocation` - Destination address
- `vehicleType` - SEDAN, SUV, LUXURY, BIKE, MINI_VAN
- `status` - REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
- `estimatedFare` - Estimated trip cost
- `actualFare` - Final trip cost
- `notes` - Additional instructions
- `createdAt`, `updatedAt` - Timestamps

### Driver Entity
- `id` - Primary key
- `user` - Associated user account
- `vehicleType` - Type of vehicle
- `licenseNumber` - Driver's license
- `status` - AVAILABLE, BUSY, OFFLINE
- `rating` - Average rating
- `createdAt`, `updatedAt` - Timestamps

## 🔧 Configuration

### Application Properties
```properties
# Server Configuration
server.port=8080

# Database Configuration (H2)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173
```

## 🧪 Testing

### Running Tests
```bash
./mvnw test
```

### API Testing
You can test the API endpoints using:
- **Postman** or **Insomnia**
- **cURL** commands
- **H2 Console** at `http://localhost:8080/h2-console`

### Sample API Calls

#### Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "role": "PASSENGER"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Book a trip (with JWT token):
```bash
curl -X POST http://localhost:8080/api/trip/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pickupLocation": "123 Main St",
    "destinationLocation": "456 Oak Ave",
    "vehicleType": "SEDAN",
    "notes": "Please arrive on time"
  }'
```

## 🔒 Security

### JWT Authentication
- Tokens are generated upon successful login
- Tokens expire after 24 hours
- All protected endpoints require valid JWT token
- Token validation happens in `JwtRequestFilter`

### Password Security
- Passwords are encrypted using BCrypt
- Password validation on registration
- Secure password storage

### CORS Configuration
- Configured to allow frontend requests
- Specific origin allowed: `http://localhost:5173`
- All HTTP methods allowed for development

## 🚀 Deployment

### Building the Application
```bash
./mvnw clean package
```

### Running the JAR
```bash
java -jar target/rideshare-backend-0.0.1-SNAPSHOT.jar
```

### Production Configuration
For production deployment:
1. Change database to PostgreSQL or MySQL
2. Update JWT secret
3. Configure CORS for production domain
4. Set appropriate logging levels

## 📊 Monitoring

### H2 Console
Access the database console at: `http://localhost:8080/h2-console`

### Logging
Application logs are available in the console with different levels:
- `DEBUG` - Detailed debugging information
- `INFO` - General application information
- `WARN` - Warning messages
- `ERROR` - Error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Backend API Documentation** 📚 