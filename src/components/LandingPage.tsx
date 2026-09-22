import React from 'react';
import { 
  Calendar, 
  Search, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Stethoscope,
  Scissors,
  Wrench,
  GraduationCap,
  Dumbbell,
  Briefcase,
  Scale,
  Car,
  UserCheck
} from 'lucide-react';
import { BusinessCategory } from '../types';

interface LandingPageProps {
  onOpenAuth: (mode?: 'login' | 'choice') => void;
  onExploreServices: (category?: BusinessCategory) => void;
  onHowItWorks: () => void;
  onAbout: () => void;
}

const CATEGORIES: { label: BusinessCategory; icon: React.FC<{ className?: string }>; desc: string }[] = [
  { label: 'Healthcare', icon: Stethoscope, desc: 'Doctors, clinics, wellness checks' },
  { label: 'Beauty & Salon', icon: Scissors, desc: 'Hair styling, facials, spa sessions' },
  { label: 'Technology & Repair', icon: Wrench, desc: 'Computer repair, screen replacement' },
  { label: 'Education', icon: GraduationCap, desc: 'Counseling, academic support, tutoring' },
  { label: 'Fitness & Wellness', icon: Dumbbell, desc: 'Personal training, yoga, gym slots' },
  { label: 'Consulting', icon: Briefcase, desc: 'Business strategy, financial advice' },
  { label: 'Legal', icon: Scale, desc: 'Legal consultation, document review' },
  { label: 'Automotive', icon: Car, desc: 'Car servicing, detailing, inspection' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreServices,
  onHowItWorks,
  onAbout
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                AppointmentHub
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-600 transition-colors">
                Home
              </button>
              <button onClick={() => onExploreServices()} className="hover:text-indigo-600 transition-colors">
                Explore Services
              </button>
              <button onClick={onHowItWorks} className="hover:text-indigo-600 transition-colors">
                How It Works
              </button>
              <button onClick={onAbout} className="hover:text-indigo-600 transition-colors">
                About
              </button>
            </nav>

            {/* Right Auth Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="py-2 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-all"
              >
                Sign In
              </button>

              <button
                onClick={() => onOpenAuth('choice')}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      <main className="space-y-16 pb-16">

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-20 border-b border-slate-800">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Modern Appointment Booking Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Book appointments <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">without the hassle.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover local service providers, choose a provider, find an available time slot, and manage all your appointments in one place.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onExploreServices()}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Find a Service</span>
              </button>

              <button
                onClick={() => onOpenAuth('choice')}
                className="py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Get Started</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Availability</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Easy Rescheduling</span>
              </div>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              How AppointmentHub Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Three simple steps to schedule your next appointment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-base">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Explore Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified local clinics, salons, repair centers, and educators near you.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-base">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Choose Date & Slot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pick a time that fits your schedule from real-time available time slots.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-base">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Manage in Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive instant booking pass, view upcoming schedules, and reschedule whenever needed.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Popular Service Categories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Find trusted professionals across industry categories
              </p>
            </div>

            <button
              onClick={() => onExploreServices()}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.label}
                  onClick={() => onExploreServices(cat.label)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Simple Final CTA */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-5 border border-slate-800 shadow-xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you a service provider or business owner?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              List your services, configure custom working hours, and manage all your customer appointments seamlessly with AppointmentHub.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAuth('choice')}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Register Your Business</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">AppointmentHub</span>
            <span>• General-Purpose Appointment Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onExploreServices()} className="hover:text-slate-900">Explore</button>
            <button onClick={onHowItWorks} className="hover:text-slate-900">How It Works</button>
            <button onClick={onAbout} className="hover:text-slate-900">About</button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-slate-900 font-semibold">Sign In</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
