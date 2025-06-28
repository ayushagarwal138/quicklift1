import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { citiesAPI } from '../api/cities';
import { indianCities, searchCities as searchLocalCities, getCitiesByState as getLocalCitiesByState, getAllStates as getLocalStates, getPopularCities as getLocalPopularCities } from '../data/indianCities';

const CitySelector = ({ 
  value, 
  onChange, 
  placeholder = "Select a city", 
  className = "",
  showState = true,
  onCitySelect = null 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalData, setUseLocalData] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log('CitySelector: Component mounted');
    loadStates();
    loadPopularCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('CitySelector: searchQuery or selectedState changed', { searchQuery, selectedState });
    if (searchQuery.length >= 2) {
      searchCities();
    } else if (selectedState) {
      loadCitiesByState();
    } else {
      setFilteredCities(cities);
    }
  }, [searchQuery, selectedState]);

  const loadStates = async () => {
    try {
      console.log('CitySelector: Loading states from API...');
      const statesData = await citiesAPI.getAllStates();
      console.log('CitySelector: States loaded from API:', statesData);
      setStates(statesData);
    } catch (error) {
      console.error('Error loading states from API, using local data:', error);
      setUseLocalData(true);
      const localStates = getLocalStates();
      console.log('CitySelector: Using local states:', localStates);
      setStates(localStates);
    }
  };

  const loadPopularCities = async () => {
    try {
      console.log('CitySelector: Loading popular cities from API...');
      const citiesData = await citiesAPI.getPopularCities();
      console.log('CitySelector: Popular cities loaded from API:', citiesData);
      setCities(citiesData);
      setFilteredCities(citiesData);
    } catch (error) {
      console.error('Error loading popular cities from API, using local data:', error);
      setUseLocalData(true);
      const localCities = getLocalPopularCities();
      console.log('CitySelector: Using local popular cities:', localCities);
      setCities(localCities);
      setFilteredCities(localCities);
    }
  };

  const searchCities = async () => {
    if (searchQuery.length < 2) return;
    
    console.log('CitySelector: Searching cities for query:', searchQuery);
    setIsLoading(true);
    try {
      if (useLocalData) {
        console.log('CitySelector: Using local search');
        const localResults = searchLocalCities(searchQuery);
        console.log('CitySelector: Local search results:', localResults);
        setFilteredCities(localResults);
      } else {
        console.log('CitySelector: Using API search');
        const citiesData = await citiesAPI.searchCities(searchQuery);
        console.log('CitySelector: API search results:', citiesData);
        setFilteredCities(citiesData);
      }
    } catch (error) {
      console.error('Error searching cities, using local data:', error);
      setUseLocalData(true);
      const localResults = searchLocalCities(searchQuery);
      console.log('CitySelector: Fallback local search results:', localResults);
      setFilteredCities(localResults);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCitiesByState = async () => {
    if (!selectedState) return;
    
    console.log('CitySelector: Loading cities for state:', selectedState);
    setIsLoading(true);
    try {
      if (useLocalData) {
        console.log('CitySelector: Using local state filter');
        const localResults = getLocalCitiesByState(selectedState);
        console.log('CitySelector: Local state results:', localResults);
        setFilteredCities(localResults);
      } else {
        console.log('CitySelector: Using API state filter');
        const citiesData = await citiesAPI.getCitiesByState(selectedState);
        console.log('CitySelector: API state results:', citiesData);
        setFilteredCities(citiesData);
      }
    } catch (error) {
      console.error('Error loading cities by state, using local data:', error);
      setUseLocalData(true);
      const localResults = getLocalCitiesByState(selectedState);
      console.log('CitySelector: Fallback local state results:', localResults);
      setFilteredCities(localResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    console.log('CitySelector: City selected:', city);
    const cityDisplay = showState ? `${city.name}, ${city.state}` : city.name;
    onChange(cityDisplay);
    if (onCitySelect) {
      onCitySelect(city);
    }
    setSearchQuery('');
    setSelectedState('');
    setIsOpen(false);
  };

  const handleStateSelect = (state) => {
    console.log('CitySelector: State selected:', state);
    setSelectedState(state);
    setSearchQuery('');
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log('CitySelector: Input changed:', newValue);
    onChange(newValue);
    setSearchQuery(newValue);
    
    // If input is empty, show popular cities
    if (!newValue.trim()) {
      setFilteredCities(cities);
    }
  };

  const handleInputFocus = () => {
    console.log('CitySelector: Input focused');
    setIsOpen(true);
    // Show popular cities when focusing on empty input
    if (!value.trim()) {
      setFilteredCities(cities);
    }
  };

  const formatCityName = (city) => {
    return showState ? `${city.name}, ${city.state}` : city.name;
  };

  console.log('CitySelector: Render state:', { 
    isOpen, 
    searchQuery, 
    cities: cities.length, 
    filteredCities: filteredCities.length, 
    isLoading, 
    useLocalData 
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="p-3 border-b border-gray-200">
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Cities List */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2">Loading cities...</p>
              </div>
            ) : filteredCities.length > 0 ? (
              <div>
                {filteredCities.map((city) => (
                  <button
                    key={`${city.name}-${city.state}`}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">{city.name}</div>
                    {showState && (
                      <div className="text-sm text-gray-500">{city.state}</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                {searchQuery.length > 0 ? 'No cities found' : 'No cities available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector; 