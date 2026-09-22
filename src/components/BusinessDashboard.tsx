import React, { useState } from 'react';
import { 
  Building2, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  LogOut, 
  Edit3, 
  Trash2, 
  User, 
  DollarSign, 
  Briefcase, 
  MapPin, 
  Check, 
  X,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Award,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Business, Service, Appointment, UserAccount } from '../types';

interface BusinessDashboardProps {
  currentUser: UserAccount;
  business: Business;
  services: Service[];
  appointments: Appointment[];
  onUpdateBusiness: (updated: Business) => void;
  onAddService: (newService: Omit<Service, 'id' | 'businessId'>) => void;
  onUpdateService: (updated: Service) => void;
  onDeleteService: (serviceId: number) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: 'Booked' | 'Completed' | 'Cancelled') => void;
  onLogout: () => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  currentUser,
  business,
  services,
  appointments,
  onUpdateBusiness,
  onAddService,
  onUpdateService,
  onDeleteService,
  onUpdateAppointmentStatus,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'appointments' | 'calendar' | 'services' | 'availability' | 'profile' | 'membership'
  >('dashboard');

  // Filter appointments for this business
  const bizAppointments = appointments.filter(a => a.businessId === business.id);
  const bizServices = services.filter(s => s.businessId === business.id);

  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = bizAppointments.filter(a => a.date === todayStr);
  const upcomingAppointments = bizAppointments.filter(a => a.status === 'Booked');
  const completedAppointments = bizAppointments.filter(a => a.status === 'Completed');
  const cancelledAppointments = bizAppointments.filter(a => a.status === 'Cancelled');

  // Upgrade Membership Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<'Pro' | 'Enterprise'>('Pro');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false);

  const isProActive = business.isFeatured || business.subscriptionPlan === 'Pro' || business.subscriptionPlan === 'Enterprise';

  // New Service Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(500);
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceCat, setNewServiceCat] = useState('General');

  // Edit Service State
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Availability Settings Local State
  const [workingDays, setWorkingDays] = useState<string[]>(business.workingDays || []);
  const [openingTime, setOpeningTime] = useState(business.openingTime || '09:00 AM');
  const [closingTime, setClosingTime] = useState(business.closingTime || '05:00 PM');
  const [slotDuration, setSlotDuration] = useState(business.slotDuration || 30);

  // Profile Local State
  const [bizName, setBizName] = useState(business.name);
  const [bizDesc, setBizDesc] = useState(business.description);
  const [bizPhone, setBizPhone] = useState(business.phone);
  const [bizEmail, setBizEmail] = useState(business.email);
  const [bizAddress, setBizAddress] = useState(business.address);

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness({
      ...business,
      workingDays,
      openingTime,
      closingTime,
      slotDuration
    });
    alert('Availability schedule saved successfully!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBusiness({
      ...business,
      name: bizName,
      description: bizDesc,
      phone: bizPhone,
      email: bizEmail,
      address: bizAddress
    });
    alert('Business profile updated successfully!');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    onAddService({
      name: newServiceName,
      description: newServiceDesc,
      price: Number(newServicePrice),
      duration: Number(newServiceDuration),
      category: newServiceCat,
      status: 'Active'
    });
    setShowAddServiceModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
  };

  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    onUpdateService(editingService);
    setEditingService(null);
  };

  const handleConfirmUpgrade = (plan: 'Pro' | 'Enterprise') => {
    onUpdateBusiness({
      ...business,
      isFeatured: true,
      subscriptionPlan: plan,
      subscriptionExpiresAt: '2027-12-31'
    });
    setShowUpgradeModal(false);
    setPaymentSuccessToast(true);
    setTimeout(() => setPaymentSuccessToast(false), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* Professional Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">Business Dashboard</span>
              <span className="text-[11px] text-amber-400 font-semibold block truncate max-w-[140px]">{business.name}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'appointments' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span>Appointments</span>
              </div>
              {upcomingAppointments.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-extrabold">
                  {upcomingAppointments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'calendar' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'services' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services ({bizServices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'availability' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Availability</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'profile' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Business Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between transition-all ${
                activeTab === 'membership' ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Membership & Rank</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                isProActive
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {business.subscriptionPlan || 'Free'}
              </span>
            </button>
          </nav>

        </div>

        {/* Footer User Info */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400">
            Signed in as: <strong className="text-slate-200 block truncate">{currentUser.name}</strong>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-6xl">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Business Overview</h1>
                <p className="text-xs text-slate-500">Real-time stats and schedule management for {business.name}.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>

                <button
                  onClick={() => setActiveTab('calendar')}
                  className="py-2 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs shadow-xs cursor-pointer"
                >
                  View Calendar
                </button>
              </div>
            </div>

            {/* MEMBERSHIP PROMOTIONAL & STATUS BANNER */}
            {paymentSuccessToast && (
              <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-bounce">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>🎉 Payment Successful! Your business is now upgraded to Pro Membership and ranked AT THE TOP of search results.</span>
                </div>
                <button onClick={() => setPaymentSuccessToast(false)} className="text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {isProActive ? (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-slate-950 fill-slate-950" />
                    <span className="font-black text-xs uppercase tracking-wider bg-slate-950/20 px-2.5 py-0.5 rounded-full">
                      PRO MEMBERSHIP ACTIVE
                    </span>
                  </div>
                  <h2 className="text-lg font-black tracking-tight text-slate-950">
                    Your business is ranked AT THE TOP of customer search results!
                  </h2>
                  <p className="text-xs font-semibold text-slate-900/90">
                    Your services appear above competitors, highlighted with the gold ⭐ "Featured Partner" badge.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('membership')}
                  className="py-2.5 px-5 rounded-2xl bg-slate-950 text-white font-extrabold text-xs hover:bg-slate-900 shadow-md shrink-0 transition-all cursor-pointer"
                >
                  Manage Membership Plan
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
                      RANK AT THE TOP OF SEARCH RESULTS
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-white tracking-tight">
                    Get Listed ABOVE Competitors with Paid Pro Membership
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Upgrade to Pro Membership to rank at the top of customer search & category pages, earn the "⭐ TOP FEATURED" gold badge, and receive 3x more appointment requests.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanToBuy('Pro');
                    setShowUpgradeModal(true);
                  }}
                  className="py-2.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>Upgrade to Pro (₹999/mo)</span>
                </button>
              </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Appointments</span>
                <span className="text-2xl font-black text-slate-900 block">{todayAppointments.length}</span>
                <span className="text-[10px] text-slate-500 font-medium">Scheduled for today</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Active Bookings</span>
                <span className="text-2xl font-black text-indigo-600 block">{upcomingAppointments.length}</span>
                <span className="text-[10px] text-indigo-600 font-medium">Pending fulfillment</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                <span className="text-2xl font-black text-emerald-600 block">{completedAppointments.length}</span>
                <span className="text-[10px] text-emerald-600 font-medium">Successful visits</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cancelled</span>
                <span className="text-2xl font-black text-rose-600 block">{cancelledAppointments.length}</span>
                <span className="text-[10px] text-rose-600 font-medium">Slots released</span>
              </div>

            </div>

            {/* Today's Schedule & Recent Appointments */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Customer Bookings</h2>

              {bizAppointments.length === 0 ? (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No appointments booked yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="p-3">Customer</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Date & Time</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bizAppointments.slice(0, 8).map(appt => (
                        <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            {appt.userName}
                            <span className="block text-[10px] font-normal text-slate-500">{appt.userPhone}</span>
                          </td>
                          <td className="p-3 text-slate-700 font-semibold">{appt.serviceName}</td>
                          <td className="p-3 text-slate-700">
                            {appt.date} at <strong className="text-slate-900">{appt.time}</strong>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              appt.status === 'Booked' ? 'bg-indigo-50 text-indigo-700' :
                              appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            {appt.status === 'Booked' && (
                              <>
                                <button
                                  onClick={() => onUpdateAppointmentStatus(appt.id, 'Completed')}
                                  className="py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px]"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => onUpdateAppointmentStatus(appt.id, 'Cancelled')}
                                  className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        )}

        {/* APPOINTMENTS QUEUE TAB */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Appointments Queue</h1>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <div className="space-y-3">
                {bizAppointments.map(appt => (
                  <div key={appt.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{appt.serviceName}</span>
                        <span className="text-slate-400">ID: {appt.id}</span>
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        Customer: <strong className="text-slate-800">{appt.userName}</strong> ({appt.userEmail}, {appt.userPhone})
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Scheduled: {appt.date} at {appt.time} (Price: ₹{appt.price})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                        appt.status === 'Booked' ? 'bg-indigo-50 text-indigo-700' :
                        appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {appt.status}
                      </span>

                      {appt.status === 'Booked' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateAppointmentStatus(appt.id, 'Completed')}
                            className="py-1 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => onUpdateAppointmentStatus(appt.id, 'Cancelled')}
                            className="py-1 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR VIEW TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Calendar Schedule</h1>
              <span className="text-xs text-slate-500 font-semibold">Today: {todayStr}</span>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="text-xs text-slate-600 font-medium">
                Active appointments mapped by date:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {bizAppointments.map(appt => (
                  <div key={appt.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{appt.date}</span>
                      <span className="text-indigo-600">{appt.time}</span>
                    </div>
                    <div className="font-semibold text-slate-800">{appt.serviceName}</div>
                    <div className="text-slate-500">{appt.userName}</div>
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">₹{appt.price}</span>
                      <span className={`font-bold ${
                        appt.status === 'Booked' ? 'text-indigo-600' :
                        appt.status === 'Completed' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES MANAGEMENT TAB */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Manage Service Catalog</h1>
                <p className="text-xs text-slate-500">Create, edit, or toggle availability for your offered services.</p>
              </div>

              <button
                onClick={() => setShowAddServiceModal(true)}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bizServices.map(svc => (
                <div key={svc.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{svc.name}</h3>
                      <span className="text-[11px] font-semibold text-amber-600">{svc.category}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">₹{svc.price}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{svc.description}</p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Duration: {svc.duration} mins</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingService(svc)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteService(svc.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AVAILABILITY TAB */}
        {activeTab === 'availability' && (
          <form onSubmit={handleSaveAvailability} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5 max-w-2xl">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Working Hours & Availability</h1>
              <p className="text-xs text-slate-500">Configure operating days and slot duration for booking calculations.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">Operating Days</label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setWorkingDays(prev => 
                        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      workingDays.includes(day)
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Opening Time</label>
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
                <label className="block text-xs font-bold text-slate-800 mb-1">Closing Time</label>
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

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Default Slot Interval (Minutes)</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md"
            >
              Save Schedule Settings
            </button>
          </form>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Business Profile Settings</h1>
              <p className="text-xs text-slate-500">Update public business details displayed to customers.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Business Name</label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={bizDesc}
                onChange={(e) => setBizDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={bizPhone}
                  onChange={(e) => setBizPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={bizEmail}
                  onChange={(e) => setBizEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Street Address</label>
              <input
                type="text"
                required
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md"
            >
              Update Profile Information
            </button>
          </form>
        )}

        {/* MEMBERSHIP & PAID BOOST TAB */}
        {activeTab === 'membership' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Admin Panel • Monetization & Boosts
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Paid Membership & Priority Search Boost</h1>
              <p className="text-xs text-slate-500 max-w-xl">
                Boost your business to the top of customer search and category listings. Businesses with Pro or Enterprise membership appear ABOVE free listings with gold badges.
              </p>
            </div>

            {/* Current Active Plan Status */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isProActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Crown className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
                    <span className="text-lg font-black text-white block">
                      {isProActive ? `${business.subscriptionPlan || 'Pro'} Member` : 'Free Standard Member'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 max-w-lg">
                  {isProActive
                    ? '⭐ Active Plan: Your business is currently listed AT THE TOP of customer searches in your category with top-priority placement.'
                    : 'Standard Free Plan: Your business is listed in default order. Upgrade to Pro to jump to the top rank.'}
                </p>
              </div>

              {!isProActive ? (
                <button
                  onClick={() => {
                    setSelectedPlanToBuy('Pro');
                    setShowUpgradeModal(true);
                  }}
                  className="py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>Buy Pro Membership (₹999/mo)</span>
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Priority Rank Active
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Valid until Dec 31, 2027</span>
                </div>
              )}
            </div>

            {/* Pricing Tiers Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Free Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Standard</span>
                    <h3 className="text-lg font-black text-slate-900">Free Plan</h3>
                    <div className="mt-2 text-2xl font-black text-slate-900">₹0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Basic business listing with standard placement and essential scheduling tools.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Standard search placement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Basic appointment queue</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Up to 10 active services</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-4 h-4 shrink-0" />
                      <span className="line-through">Top of search listing</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400">
                      <X className="w-4 h-4 shrink-0" />
                      <span className="line-through">Featured Partner gold badge</span>
                    </li>
                  </ul>
                </div>

                <button
                  disabled={!isProActive}
                  onClick={() => {
                    onUpdateBusiness({
                      ...business,
                      isFeatured: false,
                      subscriptionPlan: 'Free'
                    });
                    alert('Reverted to Free Plan.');
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                    !isProActive
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  {!isProActive ? 'Current Active Plan' : 'Downgrade to Free'}
                </button>
              </div>

              {/* Pro Card (POPULAR) */}
              <div className="bg-slate-900 text-white rounded-3xl border-2 border-amber-400 p-6 shadow-xl relative flex flex-col justify-between space-y-6">
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  <span>MOST POPULAR • TOP RANK</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Priority Boost</span>
                    <h3 className="text-xl font-black text-white">Pro Membership</h3>
                    <div className="mt-2 text-3xl font-black text-amber-400">₹999 <span className="text-xs font-normal text-slate-300">/ month</span></div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instantly places your business <strong>ABOVE free listings</strong> across all category searches.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-4 font-semibold">
                    <li className="flex items-center gap-2 text-amber-300 font-extrabold">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                      <span>Guaranteed Top Rank Placement</span>
                    </li>
                    <li className="flex items-center gap-2 text-amber-300 font-extrabold">
                      <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                      <span>⭐ "TOP FEATURED" Gold Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Gold Accent Card Border in listings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>3x Customer Search Exposure</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Unlimited service additions</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanToBuy('Pro');
                    setShowUpgradeModal(true);
                  }}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    business.subscriptionPlan === 'Pro'
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  {business.subscriptionPlan === 'Pro' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Pro Plan</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>Buy Pro Membership (₹999/mo)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Enterprise VIP Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider block">VIP Partner</span>
                    <h3 className="text-lg font-black text-slate-900">Enterprise VIP</h3>
                    <div className="mt-2 text-2xl font-black text-slate-900">₹2,499 <span className="text-xs font-normal text-slate-500">/ month</span></div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Maximum exposure with guaranteed #1 regional spot and custom promotional banners.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4 font-medium">
                    <li className="flex items-center gap-2 font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>#1 Guaranteed Top Spot in Region</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Custom Homepage Banner Ad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero Platform Booking Commission</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dedicated Account Manager</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanToBuy('Enterprise');
                    setShowUpgradeModal(true);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                    business.subscriptionPlan === 'Enterprise'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {business.subscriptionPlan === 'Enterprise' ? 'Active Enterprise VIP' : 'Upgrade to Enterprise'}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* UPGRADE PAYMENT CHECKOUT MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Activate {selectedPlanToBuy} Membership</h3>
                  <p className="text-[11px] text-slate-500">Boost {business.name} to the top of customer search listings</p>
                </div>
              </div>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Summary Card */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-amber-950">{selectedPlanToBuy} Membership Rank Plan</span>
                <span className="font-black text-amber-950 text-sm">
                  {selectedPlanToBuy === 'Pro' ? '₹999 / month' : '₹2,499 / month'}
                </span>
              </div>
              <ul className="text-[11px] text-amber-900 space-y-1 font-medium">
                <li className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600 shrink-0" />
                  <span>Ranked <strong>ABOVE free businesses</strong> on search & category pages</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Gold <strong>"TOP FEATURED"</strong> badge on your card</span>
                </li>
              </ul>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">Select Payment Method</label>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center text-xs font-extrabold transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Zap className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span>UPI Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center text-xs font-extrabold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span>Credit/Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-center text-xs font-extrabold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* Payment Details Input */}
              {paymentMethod === 'upi' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Enter VPA / UPI ID (Google Pay, PhonePe, Paytm)</label>
                  <input
                    type="text"
                    defaultValue="business@upi"
                    placeholder="e.g. 9876543210@paytm or name@okaxis"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4111 •••• •••• 8899"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="888"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Select Bank</label>
                  <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleConfirmUpgrade(selectedPlanToBuy)}
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>Pay {selectedPlanToBuy === 'Pro' ? '₹999' : '₹2,499'} & Activate Rank</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SERVICE MODAL */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Add New Service</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Dental Checkup"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Brief service description..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={editingService.duration}
                    onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
