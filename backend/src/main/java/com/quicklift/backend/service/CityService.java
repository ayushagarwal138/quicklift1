package com.quicklift.backend.service;

import com.quicklift.backend.model.City;
import com.quicklift.backend.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;

@Service
public class CityService {

    @Autowired
    private CityRepository cityRepository;

    @PostConstruct
    public void initializeCities() {
        if (cityRepository.count() == 0) {
            loadIndianCities();
        }
    }

    public List<City> searchCities(String query) {
        return cityRepository.searchCities(query);
    }

    public List<City> getCitiesByState(String state) {
        return cityRepository.findByState(state);
    }

    public List<String> getAllStates() {
        return cityRepository.findAllStates();
    }

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    private void loadIndianCities() {
        // Major Indian cities with coordinates
        City[] cities = {
            // Maharashtra
            new City("Mumbai", "Maharashtra", "MH", new BigDecimal("19.0760"), new BigDecimal("72.8777")),
            new City("Pune", "Maharashtra", "MH", new BigDecimal("18.5204"), new BigDecimal("73.8567")),
            new City("Nagpur", "Maharashtra", "MH", new BigDecimal("21.1458"), new BigDecimal("79.0882")),
            new City("Thane", "Maharashtra", "MH", new BigDecimal("19.2183"), new BigDecimal("72.9781")),
            new City("Nashik", "Maharashtra", "MH", new BigDecimal("19.9975"), new BigDecimal("73.7898")),
            new City("Aurangabad", "Maharashtra", "MH", new BigDecimal("19.8762"), new BigDecimal("75.3433")),
            new City("Solapur", "Maharashtra", "MH", new BigDecimal("17.6599"), new BigDecimal("75.9064")),
            new City("Kolhapur", "Maharashtra", "MH", new BigDecimal("16.7050"), new BigDecimal("74.2433")),
            new City("Amravati", "Maharashtra", "MH", new BigDecimal("20.9374"), new BigDecimal("77.7796")),
            new City("Nanded", "Maharashtra", "MH", new BigDecimal("19.1383"), new BigDecimal("77.3219")),

            // Delhi
            new City("New Delhi", "Delhi", "DL", new BigDecimal("28.6139"), new BigDecimal("77.2090")),
            new City("Delhi", "Delhi", "DL", new BigDecimal("28.7041"), new BigDecimal("77.1025")),

            // Karnataka
            new City("Bangalore", "Karnataka", "KA", new BigDecimal("12.9716"), new BigDecimal("77.5946")),
            new City("Mysore", "Karnataka", "KA", new BigDecimal("12.2958"), new BigDecimal("76.6394")),
            new City("Hubli", "Karnataka", "KA", new BigDecimal("15.3647"), new BigDecimal("75.1240")),
            new City("Mangalore", "Karnataka", "KA", new BigDecimal("12.9141"), new BigDecimal("74.8560")),
            new City("Belgaum", "Karnataka", "KA", new BigDecimal("15.8497"), new BigDecimal("74.4977")),
            new City("Gulbarga", "Karnataka", "KA", new BigDecimal("17.3297"), new BigDecimal("76.8343")),

            // Tamil Nadu
            new City("Chennai", "Tamil Nadu", "TN", new BigDecimal("13.0827"), new BigDecimal("80.2707")),
            new City("Coimbatore", "Tamil Nadu", "TN", new BigDecimal("11.0168"), new BigDecimal("76.9558")),
            new City("Madurai", "Tamil Nadu", "TN", new BigDecimal("9.9252"), new BigDecimal("78.1198")),
            new City("Salem", "Tamil Nadu", "TN", new BigDecimal("11.6643"), new BigDecimal("78.1460")),
            new City("Tiruchirappalli", "Tamil Nadu", "TN", new BigDecimal("10.7905"), new BigDecimal("78.7047")),
            new City("Vellore", "Tamil Nadu", "TN", new BigDecimal("12.9165"), new BigDecimal("79.1325")),

            // Telangana
            new City("Hyderabad", "Telangana", "TS", new BigDecimal("17.3850"), new BigDecimal("78.4867")),
            new City("Warangal", "Telangana", "TS", new BigDecimal("17.9689"), new BigDecimal("79.5941")),
            new City("Karimnagar", "Telangana", "TS", new BigDecimal("18.4386"), new BigDecimal("79.1288")),

            // Andhra Pradesh
            new City("Visakhapatnam", "Andhra Pradesh", "AP", new BigDecimal("17.6868"), new BigDecimal("83.2185")),
            new City("Vijayawada", "Andhra Pradesh", "AP", new BigDecimal("16.5062"), new BigDecimal("80.6480")),
            new City("Guntur", "Andhra Pradesh", "AP", new BigDecimal("16.2991"), new BigDecimal("80.4575")),
            new City("Nellore", "Andhra Pradesh", "AP", new BigDecimal("14.4426"), new BigDecimal("79.9865")),

            // Kerala
            new City("Thiruvananthapuram", "Kerala", "KL", new BigDecimal("8.5241"), new BigDecimal("76.9366")),
            new City("Kochi", "Kerala", "KL", new BigDecimal("9.9312"), new BigDecimal("76.2673")),
            new City("Kozhikode", "Kerala", "KL", new BigDecimal("11.2588"), new BigDecimal("75.7804")),
            new City("Thrissur", "Kerala", "KL", new BigDecimal("10.5276"), new BigDecimal("76.2144")),

            // Gujarat
            new City("Ahmedabad", "Gujarat", "GJ", new BigDecimal("23.0225"), new BigDecimal("72.5714")),
            new City("Surat", "Gujarat", "GJ", new BigDecimal("21.1702"), new BigDecimal("72.8311")),
            new City("Vadodara", "Gujarat", "GJ", new BigDecimal("22.3072"), new BigDecimal("73.1812")),
            new City("Rajkot", "Gujarat", "GJ", new BigDecimal("22.3039"), new BigDecimal("70.8022")),
            new City("Bhavnagar", "Gujarat", "GJ", new BigDecimal("21.7645"), new BigDecimal("72.1519")),

            // West Bengal
            new City("Kolkata", "West Bengal", "WB", new BigDecimal("22.5726"), new BigDecimal("88.3639")),
            new City("Howrah", "West Bengal", "WB", new BigDecimal("22.5958"), new BigDecimal("88.2636")),
            new City("Durgapur", "West Bengal", "WB", new BigDecimal("23.5204"), new BigDecimal("87.3119")),
            new City("Asansol", "West Bengal", "WB", new BigDecimal("23.6889"), new BigDecimal("86.9661")),

            // Uttar Pradesh
            new City("Lucknow", "Uttar Pradesh", "UP", new BigDecimal("26.8467"), new BigDecimal("80.9462")),
            new City("Kanpur", "Uttar Pradesh", "UP", new BigDecimal("26.4499"), new BigDecimal("80.3319")),
            new City("Agra", "Uttar Pradesh", "UP", new BigDecimal("27.1767"), new BigDecimal("78.0081")),
            new City("Varanasi", "Uttar Pradesh", "UP", new BigDecimal("25.3176"), new BigDecimal("82.9739")),
            new City("Prayagraj", "Uttar Pradesh", "UP", new BigDecimal("25.4358"), new BigDecimal("81.8463")),
            new City("Ghaziabad", "Uttar Pradesh", "UP", new BigDecimal("28.6692"), new BigDecimal("77.4538")),
            new City("Noida", "Uttar Pradesh", "UP", new BigDecimal("28.5355"), new BigDecimal("77.3910")),

            // Rajasthan
            new City("Jaipur", "Rajasthan", "RJ", new BigDecimal("26.9124"), new BigDecimal("75.7873")),
            new City("Jodhpur", "Rajasthan", "RJ", new BigDecimal("26.2389"), new BigDecimal("73.0243")),
            new City("Kota", "Rajasthan", "RJ", new BigDecimal("25.2138"), new BigDecimal("75.8648")),
            new City("Bikaner", "Rajasthan", "RJ", new BigDecimal("28.0229"), new BigDecimal("73.3119")),
            new City("Ajmer", "Rajasthan", "RJ", new BigDecimal("26.4499"), new BigDecimal("74.6399")),

            // Madhya Pradesh
            new City("Bhopal", "Madhya Pradesh", "MP", new BigDecimal("23.2599"), new BigDecimal("77.4126")),
            new City("Indore", "Madhya Pradesh", "MP", new BigDecimal("22.7196"), new BigDecimal("75.8577")),
            new City("Jabalpur", "Madhya Pradesh", "MP", new BigDecimal("23.1815"), new BigDecimal("79.9864")),
            new City("Gwalior", "Madhya Pradesh", "MP", new BigDecimal("26.2183"), new BigDecimal("78.1828")),
            new City("Ujjain", "Madhya Pradesh", "MP", new BigDecimal("23.1765"), new BigDecimal("75.7885")),

            // Punjab
            new City("Chandigarh", "Punjab", "PB", new BigDecimal("30.7333"), new BigDecimal("76.7794")),
            new City("Ludhiana", "Punjab", "PB", new BigDecimal("30.9010"), new BigDecimal("75.8573")),
            new City("Amritsar", "Punjab", "PB", new BigDecimal("31.6340"), new BigDecimal("74.8723")),
            new City("Jalandhar", "Punjab", "PB", new BigDecimal("31.3260"), new BigDecimal("75.5762")),
            new City("Patiala", "Punjab", "PB", new BigDecimal("30.3398"), new BigDecimal("76.3869")),

            // Haryana
            new City("Gurgaon", "Haryana", "HR", new BigDecimal("28.4595"), new BigDecimal("77.0266")),
            new City("Faridabad", "Haryana", "HR", new BigDecimal("28.4089"), new BigDecimal("77.3178")),
            new City("Panipat", "Haryana", "HR", new BigDecimal("29.3909"), new BigDecimal("76.9635")),
            new City("Yamunanagar", "Haryana", "HR", new BigDecimal("30.1290"), new BigDecimal("77.2674")),

            // Bihar
            new City("Patna", "Bihar", "BR", new BigDecimal("25.5941"), new BigDecimal("85.1376")),
            new City("Gaya", "Bihar", "BR", new BigDecimal("24.7914"), new BigDecimal("85.0002")),
            new City("Bhagalpur", "Bihar", "BR", new BigDecimal("25.2445"), new BigDecimal("86.9718")),
            new City("Muzaffarpur", "Bihar", "BR", new BigDecimal("26.1209"), new BigDecimal("85.3647")),

            // Odisha
            new City("Bhubaneswar", "Odisha", "OD", new BigDecimal("20.2961"), new BigDecimal("85.8245")),
            new City("Cuttack", "Odisha", "OD", new BigDecimal("20.4625"), new BigDecimal("85.8830")),
            new City("Rourkela", "Odisha", "OD", new BigDecimal("22.2492"), new BigDecimal("84.8828")),
            new City("Brahmapur", "Odisha", "OD", new BigDecimal("19.3149"), new BigDecimal("84.7941")),

            // Assam
            new City("Guwahati", "Assam", "AS", new BigDecimal("26.1445"), new BigDecimal("91.7362")),
            new City("Silchar", "Assam", "AS", new BigDecimal("24.8333"), new BigDecimal("92.7789")),
            new City("Dibrugarh", "Assam", "AS", new BigDecimal("27.4728"), new BigDecimal("95.0195")),

            // Jharkhand
            new City("Ranchi", "Jharkhand", "JH", new BigDecimal("23.3441"), new BigDecimal("85.3096")),
            new City("Jamshedpur", "Jharkhand", "JH", new BigDecimal("22.8046"), new BigDecimal("86.2029")),
            new City("Dhanbad", "Jharkhand", "JH", new BigDecimal("23.7957"), new BigDecimal("86.4304")),
            new City("Bokaro", "Jharkhand", "JH", new BigDecimal("23.6693"), new BigDecimal("85.2843")),

            // Chhattisgarh
            new City("Raipur", "Chhattisgarh", "CG", new BigDecimal("21.2514"), new BigDecimal("81.6296")),
            new City("Bhilai", "Chhattisgarh", "CG", new BigDecimal("21.2092"), new BigDecimal("81.4285")),
            new City("Bilaspur", "Chhattisgarh", "CG", new BigDecimal("22.0796"), new BigDecimal("82.1391")),

            // Uttarakhand
            new City("Dehradun", "Uttarakhand", "UK", new BigDecimal("30.3165"), new BigDecimal("78.0322")),
            new City("Haridwar", "Uttarakhand", "UK", new BigDecimal("29.9457"), new BigDecimal("78.1642")),
            new City("Roorkee", "Uttarakhand", "UK", new BigDecimal("29.8543"), new BigDecimal("77.8880")),

            // Himachal Pradesh
            new City("Shimla", "Himachal Pradesh", "HP", new BigDecimal("31.1048"), new BigDecimal("77.1734")),
            new City("Mandi", "Himachal Pradesh", "HP", new BigDecimal("31.7084"), new BigDecimal("76.9312")),
            new City("Solan", "Himachal Pradesh", "HP", new BigDecimal("30.9049"), new BigDecimal("77.0967")),

            // Jammu and Kashmir
            new City("Srinagar", "Jammu and Kashmir", "JK", new BigDecimal("34.0837"), new BigDecimal("74.7973")),
            new City("Jammu", "Jammu and Kashmir", "JK", new BigDecimal("32.7266"), new BigDecimal("74.8570")),

            // Goa
            new City("Panaji", "Goa", "GA", new BigDecimal("15.4909"), new BigDecimal("73.8278")),
            new City("Margao", "Goa", "GA", new BigDecimal("15.2993"), new BigDecimal("73.9862")),

            // Tripura
            new City("Agartala", "Tripura", "TR", new BigDecimal("23.8315"), new BigDecimal("91.2868")),

            // Manipur
            new City("Imphal", "Manipur", "MN", new BigDecimal("24.8170"), new BigDecimal("93.9368")),

            // Meghalaya
            new City("Shillong", "Meghalaya", "ML", new BigDecimal("25.5788"), new BigDecimal("91.8933")),

            // Nagaland
            new City("Kohima", "Nagaland", "NL", new BigDecimal("25.6751"), new BigDecimal("94.1086")),

            // Mizoram
            new City("Aizawl", "Mizoram", "MZ", new BigDecimal("23.7307"), new BigDecimal("92.7173")),

            // Arunachal Pradesh
            new City("Itanagar", "Arunachal Pradesh", "AR", new BigDecimal("27.0844"), new BigDecimal("93.6053")),

            // Sikkim
            new City("Gangtok", "Sikkim", "SK", new BigDecimal("27.3389"), new BigDecimal("88.6065")),

            // Union Territories
            new City("Port Blair", "Andaman and Nicobar Islands", "AN", new BigDecimal("11.6234"), new BigDecimal("92.7265")),
            new City("Kavaratti", "Lakshadweep", "LD", new BigDecimal("10.5593"), new BigDecimal("72.6358")),
            new City("Silvassa", "Dadra and Nagar Haveli and Daman and Diu", "DN", new BigDecimal("20.2704"), new BigDecimal("72.9477")),
            new City("Puducherry", "Puducherry", "PY", new BigDecimal("11.9416"), new BigDecimal("79.8083"))
        };

        for (City city : cities) {
            cityRepository.save(city);
        }
    }
} 