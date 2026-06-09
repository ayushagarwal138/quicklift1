import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Car, Loader2, Mail, Phone, Lock, CreditCard } from 'lucide-react';
import { authAPI } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'USER',
    licenseNumber: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.roles?.includes('DRIVER')) {
        navigate('/driver/dashboard');
      } else if (user.roles?.includes('USER')) {
        navigate('/user/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register form submitted', formData);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 10) {
      setError('Password must be at least 10 characters long');
      return;
    }

    setLoading(true);

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      role: formData.role
    };

    if (formData.role === 'DRIVER') {
      userData.licenseNumber = formData.licenseNumber;
      userData.vehicleType = formData.vehicleType;
      userData.vehicleModel = formData.vehicleModel;
      userData.vehicleColor = formData.vehicleColor;
      userData.licensePlate = formData.licensePlate;
    }

    const result = await register(userData);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleUsernameBlur = async () => {
    if (!formData.username) return;
    setCheckingUsername(true);
    try {
      const available = await authAPI.checkUsername(formData.username);
      setUsernameAvailable(available);
    } catch {
      setUsernameAvailable(true);
    }
    setCheckingUsername(false);
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    setCheckingEmail(true);
    try {
      const available = await authAPI.checkEmail(formData.email);
      setEmailAvailable(available);
    } catch {
      setEmailAvailable(true);
    }
    setCheckingEmail(false);
  };

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 10) score++;
    if (p.length >= 14) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    return { level: 3, label: 'Strong', color: 'bg-emerald-500' };
  })();

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-600 via-brand-700 to-surface-900 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <img
            src="/QuickLift_logo.png"
            alt="QuickLift"
            className="w-64 mb-8"
          />
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Start your<br/>
            <span className="text-brand-300">journey today.</span>
          </h1>
          <p className="text-lg text-brand-200/80 max-w-md">
            Join thousands of riders and drivers on the most trusted ride-sharing platform.
          </p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/QuickLift_logo(1).png"
              alt="QuickLift"
              className="w-16 h-16 mx-auto rounded-2xl shadow-lg mb-4"
            />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              Quick<span className="text-brand-600 dark:text-brand-400">Lift</span>
            </h1>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              Join our ride-sharing platform
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 animate-fade-in">
                <div className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Role Selector */}
            <div>
              <label className="input-label">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'USER' } })}
                  className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === 'USER'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Rider</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange({ target: { name: 'role', value: 'DRIVER' } })}
                  className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.role === 'DRIVER'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  <span className="font-semibold">Driver</span>
                </button>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="input-label">First Name</label>
                <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="input" placeholder="First name" />
              </div>
              <div>
                <label htmlFor="lastName" className="input-label">Last Name</label>
                <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="input" placeholder="Last name" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="input-label">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="username" name="username" type="text" required
                  value={formData.username} onChange={handleChange} onBlur={handleUsernameBlur}
                  className={`input pl-11 ${!usernameAvailable ? 'input-error' : ''}`}
                  placeholder="Choose a username"
                />
              </div>
              {!usernameAvailable && <p className="text-red-500 text-xs mt-1.5 font-medium">This username is already taken.</p>}
              {checkingUsername && <p className="text-surface-400 text-xs mt-1.5">Checking availability...</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="input-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange} onBlur={handleEmailBlur}
                  className={`input pl-11 ${!emailAvailable ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {!emailAvailable && <p className="text-red-500 text-xs mt-1.5 font-medium">This email is already registered.</p>}
              {checkingEmail && <p className="text-surface-400 text-xs mt-1.5">Checking availability...</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className="input-label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="input pl-11" placeholder="Enter your phone number" />
              </div>
            </div>

            {/* Driver-specific fields */}
            {formData.role === 'DRIVER' && (
              <div className="space-y-5 p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800/30 animate-fade-in">
                <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Vehicle Information
                </h3>
                <div>
                  <label htmlFor="licenseNumber" className="input-label">License Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input id="licenseNumber" name="licenseNumber" type="text" required value={formData.licenseNumber} onChange={handleChange} className="input pl-11" placeholder="Enter license number" />
                  </div>
                </div>
                <div>
                  <label htmlFor="vehicleType" className="input-label">Vehicle Type</label>
                  <select id="vehicleType" name="vehicleType" required value={formData.vehicleType} onChange={handleChange} className="input">
                    <option value="">Select vehicle type</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="MINIVAN">Minivan</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vehicleModel" className="input-label">Vehicle Model</label>
                    <input id="vehicleModel" name="vehicleModel" type="text" required value={formData.vehicleModel} onChange={handleChange} className="input" placeholder="e.g. Swift Dzire" />
                  </div>
                  <div>
                    <label htmlFor="vehicleColor" className="input-label">Vehicle Color</label>
                    <input id="vehicleColor" name="vehicleColor" type="text" required value={formData.vehicleColor} onChange={handleChange} className="input" placeholder="e.g. White" />
                  </div>
                </div>
                <div>
                  <label htmlFor="licensePlate" className="input-label">License Plate</label>
                  <input id="licensePlate" name="licensePlate" type="text" required value={formData.licensePlate} onChange={handleChange} className="input" placeholder="e.g. MH 12 AB 1234" />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  value={formData.password} onChange={handleChange}
                  className="input pl-11 pr-12" placeholder="Create a password (min 10 chars)"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? passwordStrength.color : 'bg-surface-200 dark:bg-surface-700'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-').replace('-500', '-600')}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="input pl-11 pr-12" placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !usernameAvailable || !emailAvailable}
              className="btn-primary w-full btn-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>

            <p className="text-center text-sm text-surface-500 dark:text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
