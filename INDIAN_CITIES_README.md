# Indian Cities Integration for Rideshare Application

This document describes the comprehensive Indian cities integration that has been added to the rideshare application, providing users with access to all major Indian cities for booking rides.

## Overview

The Indian cities feature includes:
- **150+ Major Indian Cities** with accurate coordinates
- **28 States and Union Territories** coverage
- **Real-time city search** with autocomplete
- **State-based filtering** for easier city selection
- **Distance calculation** between cities for fare estimation
- **Popular cities** quick access

## Backend Implementation

### Models

#### City.java
```java
@Entity
@Table(name = "cities")
public class City {
    private Long id;
    private String name;
    private String state;
    private String stateCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String timezone;
    private String postalCode;
    private String country = "India";
    private String countryCode = "IN";
}
```

### Repository

#### CityRepository.java
- `findByNameContainingIgnoreCase(String name)` - Search cities by name
- `findByStateContainingIgnoreCase(String state)` - Search cities by state
- `searchCities(String query)` - Combined search in name and state
- `findAllStates()` - Get all unique states
- `findByState(String state)` - Get cities by specific state

### Service

#### CityService.java
- **Automatic initialization** of cities on application startup
- **Search functionality** with fuzzy matching
- **State-based filtering**
- **Popular cities** retrieval

### Controller

#### CityController.java
- `GET /api/cities/search?query={query}` - Search cities
- `GET /api/cities/states` - Get all states
- `GET /api/cities/state/{state}` - Get cities by state
- `GET /api/cities` - Get all cities
- `GET /api/cities/popular` - Get popular metro cities

## Frontend Implementation

### API Module

#### cities.js
```javascript
export const citiesAPI = {
  searchCities: async (query) => { /* ... */ },
  getAllStates: async () => { /* ... */ },
  getCitiesByState: async (state) => { /* ... */ },
  getAllCities: async () => { /* ... */ },
  getPopularCities: async () => { /* ... */ }
};
```

### Components

#### CitySelector.jsx
A reusable component with:
- **Autocomplete search** with real-time filtering
- **State-based filtering** dropdown
- **Loading states** and error handling
- **Click outside** to close functionality
- **Keyboard navigation** support

Features:
- Search cities by name or state
- Filter by specific state
- Popular cities shown by default
- Responsive design
- Accessible UI

### Data

#### indianCities.js
Comprehensive data file containing:
- **150+ cities** with accurate coordinates
- **Population data** for major cities
- **City types** (Metro, Tier1)
- **Helper functions** for data manipulation

## Cities Coverage

### Metro Cities (8)
- Mumbai, Maharashtra
- Delhi, Delhi
- Bangalore, Karnataka
- Hyderabad, Telangana
- Chennai, Tamil Nadu
- Kolkata, West Bengal
- Pune, Maharashtra
- Ahmedabad, Gujarat

### Major States Coverage
- **Maharashtra**: 25+ cities (Mumbai, Pune, Nagpur, Thane, etc.)
- **Uttar Pradesh**: 20+ cities (Lucknow, Kanpur, Agra, Varanasi, etc.)
- **Karnataka**: 15+ cities (Bangalore, Mysore, Hubli, Mangalore, etc.)
- **Tamil Nadu**: 15+ cities (Chennai, Coimbatore, Madurai, Salem, etc.)
- **Gujarat**: 10+ cities (Ahmedabad, Surat, Vadodara, Rajkot, etc.)
- **Rajasthan**: 10+ cities (Jaipur, Jodhpur, Kota, Bikaner, etc.)
- **Madhya Pradesh**: 8+ cities (Bhopal, Indore, Jabalpur, Gwalior, etc.)
- **West Bengal**: 8+ cities (Kolkata, Howrah, Durgapur, Asansol, etc.)

### Union Territories
- Delhi
- Chandigarh
- Puducherry
- Andaman and Nicobar Islands
- Lakshadweep
- Dadra and Nagar Haveli and Daman and Diu

### North Eastern States
- Assam (Guwahati, Silchar, Dibrugarh)
- Manipur (Imphal)
- Meghalaya (Shillong)
- Nagaland (Kohima)
- Mizoram (Aizawl)
- Arunachal Pradesh (Itanagar)
- Tripura (Agartala)
- Sikkim (Gangtok)

## Features

### 1. Smart Search
- Real-time search as you type
- Searches both city name and state
- Minimum 2 characters required
- Case-insensitive matching

### 2. State Filtering
- Dropdown with all Indian states
- Filter cities by selected state
- Clear filter option

### 3. Popular Cities
- Quick access to major metro cities
- Shown by default when no search is active
- Helps users quickly find common destinations

### 4. Distance Calculation
- Accurate distance calculation between cities
- Uses Haversine formula for geographic distance
- Integrated with fare estimation

### 5. Fare Estimation
- Base fare calculation based on distance
- Vehicle type multipliers
- Real-time fare updates

## Usage Examples

### Backend API Calls

```bash
# Search cities
GET /api/cities/search?query=mumbai

# Get cities by state
GET /api/cities/state/Maharashtra

# Get all states
GET /api/cities/states

# Get popular cities
GET /api/cities/popular
```

### Frontend Component Usage

```jsx
import CitySelector from '../components/CitySelector';

<CitySelector
  value={pickupLocation}
  onChange={setPickupLocation}
  placeholder="Select pickup city"
  onCitySelect={handleCitySelect}
/>
```

## Database Schema

```sql
CREATE TABLE cities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    timezone VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    country_code VARCHAR(2) DEFAULT 'IN'
);
```

## Configuration

### Application Properties
```properties
# Database configuration for cities
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# CORS configuration for frontend
spring.web.cors.allowed-origins=http://localhost:5173
```

## Future Enhancements

1. **More Cities**: Add more tier-2 and tier-3 cities
2. **Postal Codes**: Include postal code data for precise addressing
3. **Time Zones**: Add timezone information for scheduling
4. **City Images**: Add city images for better UX
5. **Local Language Support**: Add city names in local languages
6. **City Categories**: Add categories like tourist destinations, business hubs
7. **Real-time Traffic**: Integrate with traffic APIs
8. **City Ratings**: Add city ratings and reviews

## Testing

### Backend Tests
```bash
# Run city service tests
./mvnw test -Dtest=CityServiceTest

# Test city controller
./mvnw test -Dtest=CityControllerTest
```

### Frontend Tests
```bash
# Run component tests
npm test CitySelector.test.jsx

# Test API integration
npm test cities.test.js
```

## Performance Considerations

1. **Database Indexing**: Indexes on name, state, and coordinates
2. **Caching**: Popular cities cached in memory
3. **Pagination**: Large result sets paginated
4. **Search Optimization**: Efficient LIKE queries with proper indexing

## Security

1. **Input Validation**: All search queries validated
2. **SQL Injection Prevention**: Using parameterized queries
3. **CORS Configuration**: Proper CORS setup for frontend
4. **Rate Limiting**: API rate limiting for search endpoints

## Deployment

### Backend
```bash
cd backend
./mvnw clean package
java -jar target/rideshare-backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Support

For issues or questions regarding the Indian cities integration:
1. Check the application logs for errors
2. Verify database connectivity
3. Ensure CORS configuration is correct
4. Test API endpoints directly

## Contributing

To add more cities or improve the feature:
1. Update the `CityService.java` with new city data
2. Add corresponding frontend data in `indianCities.js`
3. Update tests to cover new functionality
4. Update this documentation

---

**Note**: This feature provides comprehensive coverage of major Indian cities and can be easily extended to include more cities or additional features as needed. 