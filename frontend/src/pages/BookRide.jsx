import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { tripsAPI } from '../api/trips';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import UserHeader from '../components/Header';
import { MapPin, Navigation, Car, Loader2, IndianRupee, CreditCard, Banknote, QrCode } from 'lucide-react';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationPicker({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

const vehicleTypes = [
  { id: 'SEDAN', name: 'Sedan', icon: '🚗', desc: 'Comfortable 4-seater' },
  { id: 'SUV', name: 'SUV', icon: '🚙', desc: 'Spacious 6-seater' },
  { id: 'LUXURY', name: 'Luxury', icon: '🏎️', desc: 'Premium experience' },
  { id: 'MOTORCYCLE', name: 'Bike', icon: '🏍️', desc: 'Quick & affordable' },
  { id: 'VAN', name: 'Van', icon: '🚐', desc: 'Groups & luggage' },
];

const paymentMethods = [
  { id: 'CASH', name: 'Cash', icon: Banknote, desc: 'Pay driver directly' },
  { id: 'CARD', name: 'Card', icon: CreditCard, desc: 'Credit/Debit card' },
  { id: 'UPI', name: 'UPI', icon: QrCode, desc: 'Instant transfer' },
];

const BookRide = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [vehicleType, setVehicleType] = useState('SEDAN');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const searchTimeout = useRef();

  const handleSearch = async (value, type) => {
    if (type === 'pickup') setPickupLocation(value);
    else setDestination(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.length < 3) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDestSuggestions([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5`);
        const data = await res.json();
        if (type === 'pickup') { setPickupSuggestions(data); setShowPickupDropdown(true); }
        else { setDestSuggestions(data); setShowDestDropdown(true); }
      } catch {}
    }, 400);
  };

  const handleSuggestionSelect = (suggestion, type) => {
    const coords = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
    if (type === 'pickup') {
      setPickupLocation(suggestion.display_name);
      setPickupCoords(coords);
      setShowPickupDropdown(false);
    } else {
      setDestination(suggestion.display_name);
      setDestinationCoords(coords);
      setShowDestDropdown(false);
    }
  };

  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      const R = 6371;
      const dLat = (destinationCoords.lat - pickupCoords.lat) * Math.PI / 180;
      const dLng = (destinationCoords.lng - pickupCoords.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(destinationCoords.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      const baseFare = { SEDAN: 12, SUV: 16, LUXURY: 25, MOTORCYCLE: 8, VAN: 20 };
      const estimate = Math.round((baseFare[vehicleType] || 12) * distance + 30);
      setFareEstimate(estimate);
    }
  }, [pickupCoords, destinationCoords, vehicleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupCoords || !destinationCoords) { error('Please select both pickup and destination on the map.'); return; }
    setLoading(true);
    try {
      const tripData = {
        pickupLocation, destination, vehicleType, notes, paymentMethod,
        pickupLatitude: pickupCoords.lat, pickupLongitude: pickupCoords.lng,
        destinationLatitude: destinationCoords.lat, destinationLongitude: destinationCoords.lng,
      };
      const trip = await tripsAPI.createTrip(tripData);
      success('Ride booked! Finding drivers...');
      navigate(`/trips/${trip.id}/select-driver`);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Location' },
    { num: 2, label: 'Vehicle' },
    { num: 3, label: 'Confirm' },
  ];

  return (
    <>
      <UserHeader />
      <div className="page-container">
        <div className="page-content py-6 sm:py-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => { if (s.num < step) setStep(s.num); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    s.num === step ? 'bg-brand-600 text-white shadow-sm' :
                    s.num < step ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 cursor-pointer' :
                    'bg-surface-100 dark:bg-surface-800 text-surface-400'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">{s.num}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < steps.length - 1 && <div className={`w-8 h-0.5 ${s.num < step ? 'bg-brand-400' : 'bg-surface-200 dark:bg-surface-700'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="card overflow-hidden h-[400px] lg:h-auto lg:min-h-[500px]">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onClick={(latlng) => {
                  if (!pickupCoords) {
                    setPickupCoords(latlng);
                    setPickupLocation(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
                  } else if (!destinationCoords) {
                    setDestinationCoords(latlng);
                    setDestination(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
                  }
                }} />
                {pickupCoords && <Marker position={pickupCoords}><Popup>Pickup</Popup></Marker>}
                {destinationCoords && <Marker position={destinationCoords} icon={greenIcon}><Popup>Destination</Popup></Marker>}
                {pickupCoords && destinationCoords && <Polyline positions={[pickupCoords, destinationCoords]} color="#3366ff" />}
              </MapContainer>
            </div>

            {/* Form Panel */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Step 1: Location */}
              {step === 1 && (
                <div className="card p-6 space-y-5 animate-fade-in">
                  <h2 className="section-title">Where to?</h2>
                  <div>
                    <label className="input-label">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
                      <input type="text" value={pickupLocation} onChange={(e) => handleSearch(e.target.value, 'pickup')} className="input pl-11" placeholder="Enter pickup address" required />
                      {showPickupDropdown && pickupSuggestions.length > 0 && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-surface-800 rounded-xl shadow-elevated border border-surface-200 dark:border-surface-700 max-h-48 overflow-y-auto">
                          {pickupSuggestions.map((s, i) => (
                            <button key={i} type="button" onClick={() => handleSuggestionSelect(s, 'pickup')} className="w-full text-left px-4 py-3 text-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors border-b border-surface-100 dark:border-surface-700/50 last:border-0">
                              {s.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Destination</label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input type="text" value={destination} onChange={(e) => handleSearch(e.target.value, 'destination')} className="input pl-11" placeholder="Enter destination address" required />
                      {showDestDropdown && destSuggestions.length > 0 && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-surface-800 rounded-xl shadow-elevated border border-surface-200 dark:border-surface-700 max-h-48 overflow-y-auto">
                          {destSuggestions.map((s, i) => (
                            <button key={i} type="button" onClick={() => handleSuggestionSelect(s, 'destination')} className="w-full text-left px-4 py-3 text-sm hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors border-b border-surface-100 dark:border-surface-700/50 last:border-0">
                              {s.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} disabled={!pickupLocation || !destination} className="btn-primary w-full">
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: Vehicle */}
              {step === 2 && (
                <div className="card p-6 space-y-5 animate-fade-in">
                  <h2 className="section-title">Choose Vehicle</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {vehicleTypes.map(v => (
                      <button key={v.id} type="button" onClick={() => setVehicleType(v.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          vehicleType === v.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                        }`}>
                        <div className="text-2xl mb-1">{v.icon}</div>
                        <div className="text-sm font-semibold text-surface-900 dark:text-white">{v.name}</div>
                        <div className="text-xs text-surface-400">{v.desc}</div>
                      </button>
                    ))}
                  </div>

                  {fareEstimate && (
                    <div className="card p-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Estimated Fare</span>
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                          <IndianRupee className="w-5 h-5" />{fareEstimate}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">Continue</button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirm */}
              {step === 3 && (
                <div className="card p-6 space-y-5 animate-fade-in">
                  <h2 className="section-title">Confirm & Pay</h2>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                        <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-surface-500 uppercase">From</p>
                        <p className="text-sm text-surface-900 dark:text-white truncate">{pickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                        <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-surface-500 uppercase">To</p>
                        <p className="text-sm text-surface-900 dark:text-white truncate">{destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="divider" />

                  {/* Payment Method */}
                  <div>
                    <label className="input-label">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {paymentMethods.map(pm => {
                        const Icon = pm.icon;
                        return (
                          <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id)}
                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                              paymentMethod === pm.id
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                            }`}>
                            <Icon className="w-5 h-5 mx-auto mb-1 text-surface-600 dark:text-surface-400" />
                            <span className="text-xs font-semibold text-surface-900 dark:text-white">{pm.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="input-label">Notes (optional)</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input" rows="2" placeholder="Any special instructions..." />
                  </div>

                  {fareEstimate && (
                    <div className="card p-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Fare</span>
                        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                          <IndianRupee className="w-5 h-5" />{fareEstimate}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Finding Drivers...</> : 'Book Ride'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookRide;