import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { UserAccount, BusinessCategory, UserRole, Business, Service } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  onRegisterUser: (data: { name: string; email: string; phone: string }) => void;
  onRegisterBusiness: (
    businessData: Omit<Business, 'id' | 'rating' | 'reviewsCount'>,
    servicesData: Omit<Service, 'id' | 'businessId'>[],
    ownerData: { name: string; email: string; phone: string }
  ) => void;
  users: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegisterUser,
  onRegisterBusiness,
  users
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'choice' | 'register_user' | 'register_business'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('USER');
  const [loginError, setLoginError] = useState('');

  // User Registration State
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [userAgreeTerms, setUserAgreeTerms] = useState(false);
  const [userRegError, setUserRegError] = useState('');

  // Business Registration Wizard Steps (1 to 5)
  const [bizStep, setBizStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');

  // Biz Info (Step 1)
  const [bizName, setBizName] = useState('');
  const [bizCategory, setBizCategory] = useState<BusinessCategory>('Healthcare');
  const [bizDesc, setBizDesc] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizWebsite, setBizWebsite] = useState('');

  // Location (Step 2)
  const [bizCountry, setBizCountry] = useState('India');
  const [bizState, setBizState] = useState('Uttar Pradesh');
  const [bizCity, setBizCity] = useState('Lucknow');
  const [bizAddress, setBizAddress] = useState('');
  const [bizPincode, setBizPincode] = useState('');
  const [bizLocType, setBizLocType] = useState<'physical' | 'online' | 'both'>('physical');

  // Services (Step 3)
  const [bizServices, setBizServices] = useState<Array<{ name: string; description: string; price: number; duration: number; category: string }>>([
    { name: 'Standard Consultation', description: 'Initial evaluation and consultation session.', price: 500, duration: 30, category: 'Consultation' }
  ]);

  // Working Hours (Step 4)
  const [workingDays, setWorkingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [openingTime, setOpeningTime] = useState('09:00 AM');
  const [closingTime, setClosingTime] = useState('05:00 PM');
  const [slotDuration, setSlotDuration] = useState(30);

  // Quick Demo Logins
  const handleDemoCustomerLogin = () => {
    const demoUser = users.find(u => u.role === 'USER') || {
      id: 'usr-1',
      name: 'Rahul Sharma',
      email: 'user@appointmenthub.com',
      phone: '+91 98765 43210',
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    onLogin(demoUser);
    onClose();
  };

  const handleDemoBusinessLogin = () => {
    const demoBizUser = users.find(u => u.role === 'BUSINESS') || {
      id: 'usr-2',
      name: 'Dr. Ananya Roy (CityCare)',
      email: 'business@appointmenthub.com',
      phone: '+91 91234 56789',
      role: 'BUSINESS',
      businessId: 1,
      createdAt: new Date().toISOString()
    };
    onLogin(demoBizUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.role === loginRole);
    if (matchedUser) {
      onLogin(matchedUser);
      onClose();
    } else {
      // Create account on the fly for smooth testing if password entered
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0],
        email: loginEmail,
        phone: '+91 98765 43210',
        role: loginRole,
        businessId: loginRole === 'BUSINESS' ? 1 : undefined,
        createdAt: new Date().toISOString()
      };
      onLogin(newUser);
      onClose();
    }
  };

  const handleUserRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRegError('');

    if (userPassword !== userConfirmPassword) {
      setUserRegError('Passwords do not match.');
      return;
    }
    if (!userAgreeTerms) {
      setUserRegError('Please agree to the Terms and Privacy Policy.');
      return;
    }

    onRegisterUser({
      name: userName,
      email: userEmail,
      phone: userPhone
    });
    onClose();
  };

  const handleBusinessRegisterComplete = () => {
    onRegisterBusiness(
      {
        name: bizName,
        category: bizCategory,
        description: bizDesc,
        phone: bizPhone || ownerPhone,
        email: bizEmail || ownerEmail,
        website: bizWebsite,
        locationType: bizLocType,
        address: bizAddress,
        city: bizCity,
        state: bizState,
        pincode: bizPincode,
        country: bizCountry,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
        status: 'Active',
        workingDays,
        openingTime,
        closingTime,
        slotDuration
      },
      bizServices.map(s => ({
        ...s,
        status: 'Active'
      })),
      {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone
      }
    );
    onClose();
  };

  const addServiceRow = () => {
    setBizServices(prev => [
      ...prev,
      { name: '', description: '', price: 0, duration: 30, category: 'General' }
    ]);
  };

  const updateServiceRow = (index: number, field: string, value: any) => {
    setBizServices(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeServiceRow = (index: number) => {
    if (bizServices.length > 1) {
      setBizServices(prev => prev.filter((_, i) => i !== index));
    }
  };

  const toggleDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-white text-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">AppointmentHub</span>
          </div>

          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' && 'Welcome back! Sign in to access your dashboard.'}
            {mode === 'choice' && 'What are you here to do today?'}
            {mode === 'register_user' && 'Create your customer account to book services.'}
            {mode === 'register_business' && `Business Onboarding (Step ${bizStep} of 5)`}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Role Toggle Pill */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginRole('USER')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginRole === 'USER'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Customer / User
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('BUSINESS')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    loginRole === 'BUSINESS'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  Business Owner / Admin
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={loginRole === 'USER' ? 'user@appointmenthub.com' : 'business@appointmenthub.com'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset link sent to email.'); }} className="text-[11px] text-indigo-600 font-semibold hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Sign In to {loginRole === 'USER' ? 'Customer Account' : 'Business Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* One-click Demo Accounts Banner */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                  Instant One-Click Demo Logins
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={handleDemoCustomerLogin}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all text-center border border-slate-200"
                  >
                    Demo Customer
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoBusinessLogin}
                    className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition-all text-center border border-amber-200"
                  >
                    Demo Business
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('choice')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Create account
                </button>
              </div>

            </form>
          )}

          {/* CHOICE MODE */}
          {mode === 'choice' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div
                  onClick={() => setMode('register_user')}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/40 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">
                      Book Appointments
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer account to search services, select times, and manage bookings.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div
                  onClick={() => setMode('register_business')}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600">
                      Manage a Business
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Business owner account to offer services, set working hours, and receive appointments.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    Start Onboarding <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* USER REGISTRATION MODE */}
          {mode === 'register_user' && (
            <form onSubmit={handleUserRegisterSubmit} className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Customer Registration</h3>
                <button type="button" onClick={() => setMode('choice')} className="text-xs text-slate-400 hover:text-slate-800 font-semibold">
                  Change Choice
                </button>
              </div>

              {userRegError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                  {userRegError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={userAgreeTerms}
                  onChange={(e) => setUserAgreeTerms(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Create Customer Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* BUSINESS REGISTRATION WIZARD MODE (STEPS 1-5) */}
          {mode === 'register_business' && (
            <div className="space-y-4">
              
              {/* Step Wizard Progress Bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-2">
                <span className={bizStep >= 1 ? 'text-amber-600' : ''}>1. Info</span>
                <span>→</span>
                <span className={bizStep >= 2 ? 'text-amber-600' : ''}>2. Location</span>
                <span>→</span>
                <span className={bizStep >= 3 ? 'text-amber-600' : ''}>3. Services</span>
                <span>→</span>
                <span className={bizStep >= 4 ? 'text-amber-600' : ''}>4. Hours</span>
                <span>→</span>
                <span className={bizStep >= 5 ? 'text-amber-600' : ''}>5. Confirm</span>
              </div>

              {/* BIZ STEP 1: Info */}
              {bizStep === 1 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Step 1: Business Information & Owner
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Dr. Ananya Roy"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        required
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        placeholder="e.g. CityCare Clinic"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={bizCategory}
                        onChange={(e) => setBizCategory(e.target.value as BusinessCategory)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                      >
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Beauty & Salon">Beauty & Salon</option>
                        <option value="Fitness & Wellness">Fitness & Wellness</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Technology & Repair">Technology & Repair</option>
                        <option value="Legal">Legal</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Personal Services">Personal Services</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Description</label>
                    <textarea
                      rows={2}
                      required
                      value={bizDesc}
                      onChange={(e) => setBizDesc(e.target.value)}
                      placeholder="Describe services provided..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={bizPhone}
                        onChange={(e) => setBizPhone(e.target.value)}
                        placeholder="+91 522 2623400"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        required
                        value={bizEmail}
                        onChange={(e) => setBizEmail(e.target.value)}
                        placeholder="contact@business.org"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      disabled={!bizName || !bizDesc}
                      onClick={() => setBizStep(2)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Next: Location</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* BIZ STEP 2: Location */}
              {bizStep === 2 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Step 2: Location & Service Type
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Service Format</label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setBizLocType('physical')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          bizLocType === 'physical' ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold' : 'bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        Physical Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setBizLocType('online')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          bizLocType === 'online' ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold' : 'bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        Online Virtual
                      </button>
                      <button
                        type="button"
                        onClick={() => setBizLocType('both')}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          bizLocType === 'both' ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold' : 'bg-slate-50 border-slate-300 text-slate-700'
                        }`}
                      >
                        Both
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={bizAddress}
                      onChange={(e) => setBizAddress(e.target.value)}
                      placeholder="e.g. 12/A Hazratganj Main Road"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={bizCity}
                        onChange={(e) => setBizCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={bizPincode}
                        onChange={(e) => setBizPincode(e.target.value)}
                        placeholder="226001"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setBizStep(1)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setBizStep(3)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Next: Add Services</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* BIZ STEP 3: Initial Services */}
              {bizStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Step 3: Define Services Provided
                    </h3>
                    <button
                      type="button"
                      onClick={addServiceRow}
                      className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
                    >
                      + Add Another Service
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {bizServices.map((service, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Service #{i + 1}</span>
                          {bizServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeServiceRow(i)}
                              className="text-rose-600 text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          required
                          value={service.name}
                          onChange={(e) => updateServiceRow(i, 'name', e.target.value)}
                          placeholder="Service Name (e.g. Dental Consultation)"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            required
                            value={service.price}
                            onChange={(e) => updateServiceRow(i, 'price', Number(e.target.value))}
                            placeholder="Price (₹)"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                          />
                          <input
                            type="number"
                            required
                            value={service.duration}
                            onChange={(e) => updateServiceRow(i, 'duration', Number(e.target.value))}
                            placeholder="Duration (Mins)"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setBizStep(2)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setBizStep(4)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Next: Hours</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* BIZ STEP 4: Working Days & Hours */}
              {bizStep === 4 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Step 4: Availability & Schedule
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Working Days</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            workingDays.includes(day)
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Time</label>
                      <select
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                      >
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Closing Time</label>
                      <select
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                      >
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setBizStep(3)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setBizStep(5)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Review & Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* BIZ STEP 5: Final Confirmation */}
              {bizStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Step 5: Onboarding Summary
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-300 text-sm">{bizName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">{bizCategory}</span>
                    </div>
                    <div>Address: {bizAddress}, {bizCity}</div>
                    <div>Hours: {openingTime} — {closingTime} ({workingDays.length} days/week)</div>
                    <div>Services Defined: {bizServices.length} service(s)</div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setBizStep(4)}
                      className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleBusinessRegisterComplete}
                      className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Create Business & Open Dashboard
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
