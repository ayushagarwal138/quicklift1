import React, { useState, useEffect } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';

const RatingModal = ({ isOpen, onSubmit, onSkip, driverName, isSubmitting }) => {
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [review, setReview] = useState('');
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setAnimate(true));
            document.body.style.overflow = 'hidden';
        } else {
            setAnimate(false);
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, review.trim());
    };

    const starLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
    const activeRating = hoveredStar || rating;

    const getStarColor = () => {
        if (activeRating <= 1) return 'text-red-400';
        if (activeRating <= 2) return 'text-orange-400';
        if (activeRating <= 3) return 'text-amber-400';
        if (activeRating <= 4) return 'text-yellow-400';
        return 'text-emerald-400';
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
                animate ? 'opacity-100' : 'opacity-0'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Rate your trip"
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    animate ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onSkip}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-md bg-white dark:bg-surface-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
                    animate
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-6'
                }`}
            >
                {/* Top gradient accent */}
                <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400" />

                {/* Skip button */}
                <button
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
                    aria-label="Skip rating"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                            <Star className="w-8 h-8 text-amber-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-1">
                            How was your ride?
                        </h2>
                        {driverName && (
                            <p className="text-sm text-surface-500 dark:text-surface-400">
                                Rate your experience with <span className="font-semibold text-surface-700 dark:text-surface-300">{driverName}</span>
                            </p>
                        )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className={`group relative transition-all duration-200 ${
                                        isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                >
                                    <Star
                                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ${
                                            star <= activeRating
                                                ? `${getStarColor()} fill-current drop-shadow-sm`
                                                : 'text-surface-200 dark:text-surface-600'
                                        } ${!isSubmitting ? 'group-hover:scale-125' : ''}`}
                                    />
                                    {/* Pulse animation on selection */}
                                    {star === rating && (
                                        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                        {/* Label */}
                        <div className={`h-6 transition-all duration-200 ${activeRating > 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <span className={`text-sm font-semibold ${getStarColor()}`}>
                                {activeRating > 0 ? starLabels[activeRating - 1] : ''}
                            </span>
                        </div>
                    </div>

                    {/* Review textarea - appears after rating */}
                    <div className={`transition-all duration-500 overflow-hidden ${
                        rating > 0 ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
                    }`}>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                            Tell us more <span className="text-surface-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Share your experience..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
                        />
                        <p className="text-xs text-surface-400 mt-1 text-right">{review.length}/500</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                rating > 0
                                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-[0.98]'
                                    : 'bg-surface-100 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Review
                                </>
                            )}
                        </button>
                        <button
                            onClick={onSkip}
                            disabled={isSubmitting}
                            className="w-full px-6 py-2.5 rounded-xl text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-all duration-200"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
