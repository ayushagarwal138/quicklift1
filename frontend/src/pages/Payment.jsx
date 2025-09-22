import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripsAPI } from '../api/trips';
import { CheckCircle, Loader2, CreditCard, QrCode, User as UserIcon, IndianRupee, MapPin, Navigation, Banknote, Star } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import UserHeader from '../components/Header';
import RatingModal from '../components/RatingModal';

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
  const [showRating, setShowRating] = useState(false);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const { success: showToast } = useToast();

  useEffect(() => {
    const fetchTrip = async () => {
      try { const data = await tripsAPI.getTripById(tripId); setTrip(data); }
      catch { setError('Could not load trip details.'); }
      finally { setLoading(false); }
    };
    fetchTrip();
  }, [tripId]);

  useEffect(() => { if (trip) setSelectedMethod(trip.paymentMethod || 'CASH'); }, [trip]);

  const validateCard = () => cardDetails.number.length === 16 && cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/[0-9]{2}$/) && cardDetails.cvv.length === 3 && cardDetails.name.trim().length > 0;
  const validateUpi = () => upiId.match(/^\w+@[\w.]+$/);
  const handleCardChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handlePay = async () => {
    setFormError('');
    if (selectedMethod === 'CARD' && !validateCard()) { setFormError('Please enter valid card details.'); return; }
    if (selectedMethod === 'UPI' && !validateUpi()) { setFormError('Please enter a valid UPI ID.'); return; }
    setPaying(true);
    try {
      if (selectedMethod !== trip.paymentMethod) await tripsAPI.updatePaymentMethod(tripId, selectedMethod);
      await tripsAPI.payForTrip(tripId);
      setSuccess(true);
      showToast('Payment successful!');
    } catch { setError('Payment failed.'); }
    finally { setPaying(false); }
  };

  const handleCashPaymentDone = async () => {
    setPaying(true);
    try {
      await tripsAPI.payForTrip(tripId);
      showToast('Payment marked as done!');
      setSuccess(true);
    } catch { setError('Failed to mark payment as done.'); }
    finally { setPaying(false); }
  };

  const handleRatingSubmit = async (rating, review) => {
    setRatingSubmitting(true);
    try {
      await tripsAPI.rateTrip(tripId, rating, review || undefined);
      showToast('Thank you for your review!');
      navigate('/user/dashboard');
    } catch {
      showToast('Review submitted!');
      navigate('/user/dashboard');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleRatingSkip = () => {
    navigate('/user/dashboard');
  };

  const upiQRUrl = upiId && validateUpi()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(upiId)}&pn=QuickLift&am=${trip?.fare || ''}`
    : null;

  if (loading) return (
    <>
      <UserHeader />
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    </>
  );
  if (error) return (
    <>
      <UserHeader />
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    </>
  );
  if (!trip) return null;

  if (success) return (
    <>
      <UserHeader />
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 p-6">
        <div className="card p-10 max-w-md w-full text-center animate-fade-in-up">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 rounded-full animate-ping opacity-30" />
            <CheckCircle className="relative w-20 h-20 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Your trip has been paid for. How was your ride?</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowRating(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 active:scale-[0.98]"
            >
              <Star className="w-5 h-5" />
              Rate Your Ride
            </button>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="w-full px-6 py-2.5 rounded-xl text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-all duration-200"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
      <RatingModal
        isOpen={showRating}
        onSubmit={handleRatingSubmit}
        onSkip={handleRatingSkip}
        driverName={trip?.driver?.username || trip?.driver?.name}
        isSubmitting={ratingSubmitting}
      />
    </>
  );

  const paymentMethods = [
    { id: 'CASH', name: 'Cash', icon: Banknote },
    { id: 'CARD', name: 'Card', icon: CreditCard },
    { id: 'UPI', name: 'UPI', icon: QrCode },
  ];

  return (
    <>
      <UserHeader />
      <div className="page-container">
        <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6 text-center">Complete Payment</h1>

            {/* Trip Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-surface-500 uppercase">From</p>
                  <p className="text-sm text-surface-900 dark:text-white truncate">{trip.pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mt-0.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-surface-500 uppercase">To</p>
                  <p className="text-sm text-surface-900 dark:text-white truncate">{trip.destination}</p>
                </div>
              </div>
            </div>

            {/* Fare */}
            <div className="card p-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Total Fare</span>
                <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                  <IndianRupee className="w-5 h-5" />{trip.fare ? trip.fare.toFixed(2) : 'N/A'}
                </span>
              </div>
            </div>

            {!trip.paid ? (
              <>
                {/* Payment Method Selector */}
                <div className="mb-6">
                  <label className="input-label">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map(pm => {
                      const Icon = pm.icon;
                      return (
                        <button key={pm.id} type="button" onClick={() => setSelectedMethod(pm.id)} disabled={paying}
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            selectedMethod === pm.id
                              ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
                          }`}>
                          <Icon className="w-5 h-5 mx-auto mb-1 text-surface-600 dark:text-surface-400" />
                          <span className="text-xs font-semibold text-surface-900 dark:text-white">{pm.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cash */}
                {selectedMethod === 'CASH' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="card p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30">
                      <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Pay the driver in cash at the end of your ride.</p>
                    </div>
                    <button className="btn-success w-full" onClick={handleCashPaymentDone} disabled={paying}>
                      {paying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : 'Mark as Paid'}
                    </button>
                  </div>
                )}

                {/* Card */}
                {selectedMethod === 'CARD' && (
                  <form className="space-y-4 animate-fade-in" onSubmit={e => { e.preventDefault(); handlePay(); }}>
                    <div>
                      <label className="input-label">Card Number</label>
                      <input type="text" name="number" placeholder="1234 5678 9012 3456" maxLength={16} className="input" value={cardDetails.number} onChange={handleCardChange} disabled={paying} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Expiry</label>
                        <input type="text" name="expiry" placeholder="MM/YY" maxLength={5} className="input" value={cardDetails.expiry} onChange={handleCardChange} disabled={paying} />
                      </div>
                      <div>
                        <label className="input-label">CVV</label>
                        <input type="text" name="cvv" placeholder="123" maxLength={3} className="input" value={cardDetails.cvv} onChange={handleCardChange} disabled={paying} />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Name on Card</label>
                      <input type="text" name="name" placeholder="John Doe" className="input" value={cardDetails.name} onChange={handleCardChange} disabled={paying} />
                    </div>
                    {formError && <p className="text-sm text-red-500">{formError}</p>}
                    <button type="submit" className="btn-primary w-full" disabled={paying || !validateCard()}>
                      {paying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5" /> Pay with Card</>}
                    </button>
                  </form>
                )}

                {/* UPI */}
                {selectedMethod === 'UPI' && (
                  <form className="space-y-4 animate-fade-in" onSubmit={e => { e.preventDefault(); handlePay(); }}>
                    <div>
                      <label className="input-label">UPI ID</label>
                      <input type="text" placeholder="user@bank" className="input" value={upiId} onChange={e => { setUpiId(e.target.value); setShowUpiQR(false); }} disabled={paying} />
                    </div>
                    {validateUpi() && (
                      <button type="button" className="btn-secondary w-full" onClick={() => setShowUpiQR(true)}>
                        <QrCode className="w-5 h-5" /> Show QR Code
                      </button>
                    )}
                    {showUpiQR && upiQRUrl && (
                      <div className="flex flex-col items-center p-4 animate-fade-in">
                        <img src={upiQRUrl} alt="UPI QR Code" className="rounded-xl border-2 border-surface-200 dark:border-surface-700 shadow-lg" />
                        <p className="text-xs text-surface-400 mt-2">Scan with your UPI app</p>
                      </div>
                    )}
                    {formError && <p className="text-sm text-red-500">{formError}</p>}
                    <button type="submit" className="btn-success w-full" disabled={paying || !validateUpi()}>
                      {paying ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><QrCode className="w-5 h-5" /> Pay with UPI</>}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="card p-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Payment already completed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;