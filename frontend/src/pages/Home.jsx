import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Shield, Star, ArrowRight, Zap } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Book a ride in seconds with our optimized booking system' },
  { icon: MapPin, title: 'Live Tracking', desc: "Know exactly where your driver is with real-time GPS tracking" },
  { icon: Shield, title: 'Secure & Safe', desc: 'All drivers are verified. Your safety is our top priority' },
  { icon: Clock, title: '24/7 Service', desc: 'Available round the clock, whenever and wherever you need' },
];

const steps = [
  { num: '01', title: 'Enter Location', desc: 'Set your pickup and drop-off points' },
  { num: '02', title: 'Choose Vehicle', desc: 'Select from our wide range of cars' },
  { num: '03', title: 'Enjoy the Ride', desc: 'Sit back and relax as we drive you' },
];

const testimonials = [
  { name: 'Sarah Jenkins', role: 'Daily Commuter', content: 'QuickLift completely changed my daily commute. Always on time, clean cars, and professional drivers.', rating: 5 },
  { name: 'Michael Chen', role: 'Business Traveler', content: 'The best ride-sharing app I have used. The live tracking is incredibly accurate and the premium rides are top-notch.', rating: 5 },
  { name: 'Priya Sharma', role: 'Student', content: 'Affordable, safe, and reliable. Customer support is also very responsive whenever I had a query.', rating: 4 },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 font-sans selection:bg-brand-500/20 selection:text-brand-900 dark:selection:text-brand-100">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-700/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/QuickLift_logo(1).png" alt="QuickLift Logo" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md" />
              <span className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
                Quick<span className="text-brand-600 dark:text-brand-400">Lift</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-6">
              <Link to="/login" className="text-sm font-semibold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary btn-sm sm:px-6 sm:py-3 whitespace-nowrap">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 sm:pt-32 pb-14 sm:pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-surface-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-6 text-center lg:text-left mb-10 sm:mb-14 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-semibold mb-6 animate-fade-in-down border border-brand-200/50 dark:border-brand-700/50">
                <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
                Now available in your city
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-surface-900 dark:text-white tracking-tight leading-[1.12] mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Your journey,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                  elevated.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-surface-600 dark:text-surface-400 mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
                Experience the next generation of ride-sharing. Fast pickups, premium vehicles, and professional drivers at your fingertips.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link to="/book" className="btn-primary w-full sm:w-auto group text-base sm:text-lg px-6 sm:px-8 sm:py-4">
                  Book a Ride
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/register" className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 sm:py-4">
                  Become a Driver
                </Link>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="lg:col-span-6 relative animate-fade-in lg:animate-slide-in-right" style={{ animationDelay: '400ms' }}>
              <div className="relative rounded-2xl bg-white dark:bg-surface-800 p-2 sm:p-4 shadow-elevated border border-surface-200/50 dark:border-surface-700/50 backdrop-blur-sm transform lg:rotate-[-2deg] lg:hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200" 
                  alt="QuickLift App" 
                  className="rounded-xl object-cover w-full h-[240px] sm:h-[400px] lg:h-[500px]"
                />
                
                {/* Floating Cards */}
                <div className="hidden sm:block absolute sm:-left-6 lg:-left-8 top-10 glass p-4 rounded-xl shadow-xl animate-bounce-subtle z-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-surface-900 dark:text-white">100% Secure</p>
                      <p className="text-[10px] sm:text-xs text-surface-500 dark:text-surface-400">Verified drivers</p>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block absolute sm:-right-4 lg:-right-6 bottom-10 glass p-4 rounded-xl shadow-xl animate-bounce-subtle z-10" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 dark:bg-brand-900/40 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-surface-900 dark:text-white">4.9/5 Rating</p>
                      <p className="text-[10px] sm:text-xs text-surface-500 dark:text-surface-400">10k+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 text-center">
            {[
              { label: 'Active Users', value: '500K+' },
              { label: 'Cities Covered', value: '120+' },
              { label: 'Completed Rides', value: '2M+' },
              { label: 'App Rating', value: '4.9/5' }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-4xl font-extrabold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-600 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-6">Built for the modern traveler</h3>
            <p className="text-lg text-surface-600 dark:text-surface-400">We've thought of everything to make your journey as comfortable and seamless as possible.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="card p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white dark:bg-surface-900">
                  <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h4 className="text-xl font-bold text-surface-900 dark:text-white mb-3">{f.title}</h4>
                  <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 sm:py-24 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-brand-600 dark:text-brand-400 font-semibold tracking-wide uppercase text-sm mb-3">How It Works</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-6">Book a ride in 3 easy steps</h3>
              <p className="text-lg text-surface-600 dark:text-surface-400 mb-10">Our streamlined booking process gets you on the road faster than ever. No complicated forms or hidden fees.</p>
              
              <div className="space-y-8">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{step.title}</h4>
                      <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/5 rounded-[3rem] transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&q=80&w=800" 
                alt="Passenger in car" 
                className="relative rounded-2xl shadow-2xl object-cover h-[280px] sm:h-[450px] lg:h-[600px] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 sm:py-24 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">Loved by thousands</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400">Don't just take our word for it. Here's what our users have to say.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-8 bg-white dark:bg-surface-900">
                <div className="flex gap-1 mb-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-surface-700 dark:text-surface-300 mb-6 italic">"{t.content}"</p>
                <div>
                  <p className="font-bold text-surface-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-brand-900" />
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to hit the road?</h2>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">Join thousands of riders who have already upgraded their daily commute.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn px-8 py-4 bg-white text-brand-900 hover:bg-surface-50 shadow-xl rounded-xl font-bold text-lg transition-transform hover:-translate-y-1">
              Book a Ride Now
            </Link>
            <Link to="/register" className="btn px-8 py-4 bg-brand-800 text-white hover:bg-brand-700 border border-brand-700 rounded-xl font-bold text-lg transition-colors">
              Sign Up to Drive
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-950 py-12 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/QuickLift_logo(1).png" alt="QuickLift" className="w-8 h-8 rounded-lg grayscale opacity-70" />
            <span className="text-xl font-bold text-surface-300">QuickLift</span>
          </div>
          <p className="text-surface-500 text-sm">© {new Date().getFullYear()} QuickLift Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-surface-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
