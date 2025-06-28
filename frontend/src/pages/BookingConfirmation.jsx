import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  CheckCircle, 
  CreditCard, 
  MapPin, 
  Clock, 
  Car, 
  User, 
  Phone,
  Calendar,
  Shield,
  ArrowLeft,
  Loader2,
  Banknote
} from 'lucide-react';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      // Redirect if no booking details
      navigate('/book');
    }
  }, [location.state, navigate]);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Pay with Visa, MasterCard, or RuPay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: CreditCard,
      description: 'Pay using UPI apps like Google Pay, PhonePe',
      popular: false
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: Banknote,
      description: 'Pay in cash to the driver after trip completion',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: CreditCard,
      description: 'Pay using your bank account',
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: CreditCard,
      description: 'Pay using Paytm, Amazon Pay, or other wallets',
      popular: false
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setBookingConfirmed(true);
      
      // Show success toast with appropriate message
      if (selectedPaymentMethod === 'cash') {
        success('Booking confirmed! Pay the driver ₹' + (bookingDetails.fare?.total?.toFixed(2) || '0.00') + ' in cash after trip completion.');
      } else {
        success('Payment successful! Your ride is confirmed.');
      }
      
      // Redirect to trip tracking after 3 seconds
      setTimeout(() => {
        navigate('/trip-tracking', { 
          state: { 
            bookingId: `BK${Date.now()}`,
            bookingDetails: bookingDetails 
          } 
        });
      }, 3000);
    }, selectedPaymentMethod === 'cash' ? 1500 : 3000); // Faster processing for cash
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your ride has been successfully booked and payment processed.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Booking ID:</strong> BK{Date.now()}
            </p>
            <p className="text-sm text-green-800 mt-1">
              {selectedPaymentMethod === 'cash' 
                ? `Pay ₹${bookingDetails.fare?.total?.toFixed(2) || '0.00'} in cash to driver`
                : 'Driver will arrive in 5-10 minutes'
              }
            </p>
          </div>
          <div className="animate-pulse">
            <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Redirecting to trip tracking...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/book')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Booking
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Confirm Your Booking</h1>
          <p className="text-gray-600 mt-2">Review your trip details and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Trip Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium">Pickup</span>
                  </div>
                  <span className="text-gray-600">{bookingDetails.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="font-medium">Destination</span>
                  </div>
                  <span className="text-gray-600">{bookingDetails.destination}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Vehicle Type</span>
                  </div>
                  <span className="text-gray-600">{bookingDetails.vehicleType}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center flex-1">
                      <method.icon className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">{method.name}</span>
                          {method.popular && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Payment</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-4">
                {/* Fare Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare</span>
                    <span>₹{bookingDetails.fare?.base?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance Charge</span>
                    <span>₹{bookingDetails.fare?.distance?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vehicle Type</span>
                    <span>₹{bookingDetails.fare?.vehicle?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span>₹{bookingDetails.fare?.taxes?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{bookingDetails.fare?.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="ml-auto font-medium">{bookingDetails.duration || '15-20 min'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Distance:</span>
                    <span className="ml-auto font-medium">{bookingDetails.distance || '8.5 km'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-auto font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {selectedPaymentMethod === 'cash' ? 'Confirming Booking...' : 'Processing Payment...'}
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === 'cash' 
                        ? `Confirm Booking - Pay ₹${bookingDetails.fare?.total?.toFixed(2) || '0.00'} in Cash`
                        : `Pay ₹${bookingDetails.fare?.total?.toFixed(2) || '0.00'}`
                      }
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                  By completing this booking, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 