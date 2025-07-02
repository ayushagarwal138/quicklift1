import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { CheckCircle, Loader2, CreditCard, QrCode, User as UserIcon, IndianRupee } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Payment = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [formError, setFormError] = useState('');
  const [showUpiQR, setShowUpiQR] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const { success: showToast } = useToast();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripsAPI.getTripById(tripId);
        setTrip(data);
      } catch (err) {
        setError('Could not load trip details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    if (trip) {
      setSelectedMethod(trip.paymentMethod || 'CASH');
    }
  }, [trip]);

  const validateCard = () => {
    return (
      cardDetails.number.length === 16 &&
      cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/) &&
      cardDetails.cvv.length === 3 &&
      cardDetails.name.trim().length > 0
    );
  };

  const validateUpi = () => {
    return upiId.match(/^\w+@[\w.]+$/);
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    setFormError('');
    if (selectedMethod === 'CARD' && !validateCard()) {
      setFormError('Please enter valid card details.');
      return;
    }
    if (selectedMethod === 'UPI' && !validateUpi()) {
      setFormError('Please enter a valid UPI ID.');
      return;
    }
    setPaying(true);
    try {
      if (selectedMethod !== trip.paymentMethod) {
        await tripsAPI.updatePaymentMethod(tripId, selectedMethod);
      }
      await tripsAPI.payForTrip(tripId); // Simulate payment
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setPaying(false);
    }
  };

  const upiQRUrl = upiId && validateUpi()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=Rideshare&am=${trip?.fare || ''}`
    : null;

  const handleCashPaymentDone = async () => {
    setPaying(true);
    try {
      await tripsAPI.payForTrip(tripId);
      showToast('Payment marked as done!');
      setTimeout(() => navigate('/user/dashboard'), 1500);
    } catch (err) {
      setError('Failed to mark payment as done.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading payment details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!trip) return <div className="text-center py-10">Trip not found.</div>;

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for your payment. Redirecting to your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-blue-100">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-4 flex items-center justify-center gap-2">
          <IndianRupee className="w-7 h-7 text-green-600" /> Pay Your Driver
        </h1>
        <div className="text-left space-y-3 mb-6">
          <div className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-blue-500" /><strong>Pickup:</strong> {trip.pickupLocation}</div>
          <div className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-green-500" /><strong>Destination:</strong> {trip.destination}</div>
          <div className="flex items-center gap-2"><IndianRupee className="w-5 h-5 text-green-600" /><strong>Fare:</strong> <span className="text-green-700 font-bold">₹{trip.fare ? trip.fare.toFixed(2) : 'N/A'}</span></div>
          {trip.driver && (
            <div className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-gray-700" /><strong>Driver:</strong> {trip.driver.user.username}</div>
          )}
          <div className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-600" /><strong>Payment Method:</strong> {selectedMethod}</div>
        </div>
        {!trip.paid && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Choose Payment Method</label>
            <div className="flex gap-4 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paymentMethod" value="CASH" checked={selectedMethod === 'CASH'} onChange={() => setSelectedMethod('CASH')} disabled={paying} />
                <span>Cash</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paymentMethod" value="CARD" checked={selectedMethod === 'CARD'} onChange={() => setSelectedMethod('CARD')} disabled={paying} />
                <span>Card</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="paymentMethod" value="UPI" checked={selectedMethod === 'UPI'} onChange={() => setSelectedMethod('UPI')} disabled={paying} />
                <span>UPI</span>
              </label>
            </div>
          </div>
        )}
        {selectedMethod === 'CASH' && !trip.paid ? (
          <div className="flex flex-col items-center mb-4">
            <div className="text-yellow-600 font-semibold mb-4">Please pay the driver in cash at the end of your ride.</div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mt-2 disabled:opacity-50 flex items-center justify-center shadow-lg"
              onClick={handleCashPaymentDone}
              disabled={paying}
            >
              {paying ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
              Payment Done
            </button>
          </div>
        ) : !trip.paid ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Choose Payment Option</label>
              <div className="flex flex-col gap-2">
                {selectedMethod === 'CARD' && (
                  <form className="space-y-3 text-left" onSubmit={e => { e.preventDefault(); handlePay(); }}>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-blue-700">Credit/Debit Card</span>
                    </div>
                    <input
                      type="text"
                      name="number"
                      placeholder="Card Number (16 digits)"
                      maxLength={16}
                      className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={cardDetails.number}
                      onChange={handleCardChange}
                      disabled={paying}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-1/2 border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        disabled={paying}
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        maxLength={3}
                        className="w-1/2 border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        disabled={paying}
                      />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name on Card"
                      className="w-full border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      disabled={paying}
                    />
                    {formError && <div className="text-red-500 text-sm">{formError}</div>}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mt-2 disabled:opacity-50 flex items-center justify-center shadow-lg"
                      disabled={paying || !validateCard()}
                    >
                      {paying ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
                      {paying ? 'Processing...' : 'Pay with Credit/Debit Card'}
                    </button>
                  </form>
                )}
                {selectedMethod === 'UPI' && (
                  <form className="space-y-3 text-left" onSubmit={e => { e.preventDefault(); handlePay(); }}>
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-6 h-6 text-green-600" />
                      <span className="font-semibold text-green-700">UPI</span>
                    </div>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="Enter UPI ID (e.g. user@bank)"
                      className="w-full border-2 border-green-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={upiId}
                      onChange={e => { setUpiId(e.target.value); setShowUpiQR(false); }}
                      disabled={paying}
                    />
                    <button
                      type="button"
                      className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 mt-2 flex items-center justify-center border border-green-300"
                      disabled={!validateUpi()}
                      onClick={() => setShowUpiQR(true)}
                    >
                      <QrCode className="w-5 h-5 mr-2" /> Show QR Code
                    </button>
                    {showUpiQR && upiQRUrl && (
                      <div className="flex flex-col items-center mt-4">
                        <img src={upiQRUrl} alt="UPI QR Code" className="rounded-lg border-2 border-green-300 shadow-md" />
                        <div className="text-xs text-gray-500 mt-2">Scan this QR with your UPI app</div>
                      </div>
                    )}
                    {formError && <div className="text-red-500 text-sm">{formError}</div>}
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 mt-2 disabled:opacity-50 flex items-center justify-center shadow-lg"
                      disabled={paying || !validateUpi()}
                    >
                      {paying ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <QrCode className="w-5 h-5 mr-2" />}
                      {paying ? 'Processing...' : 'Pay with UPI'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-green-600 font-semibold mb-4">Payment already completed.</div>
        )}
      </div>
    </div>
  );
};

export default Payment; 