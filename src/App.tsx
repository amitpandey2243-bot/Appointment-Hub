import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getUsers, 
  saveUsers, 
  getBusinesses, 
  saveBusinesses, 
  getServices, 
  saveServices, 
  getAppointments, 
  saveAppointments, 
  getReviews, 
  saveReviews, 
  getNotifications, 
  saveNotifications 
} from './utils/storage';
import { 
  UserAccount, 
  Business, 
  Service, 
  Appointment, 
  Review, 
  NotificationItem, 
  BusinessCategory 
} from './types';

import { LandingPage } from './components/LandingPage';
import { ExploreServices } from './components/ExploreServices';
import { CustomerDashboard } from './components/CustomerDashboard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { AuthModal } from './components/AuthModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { RescheduleModal } from './components/RescheduleModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { CheckCircle2, Calendar, MapPin, X } from 'lucide-react';

export default function App() {
  // State Initialization
  const [currentUserState, setCurrentUserState] = useState<UserAccount | null>(getCurrentUser());
  const [users, setUsers] = useState<UserAccount[]>(getUsers());
  const [businesses, setBusinesses] = useState<Business[]>(getBusinesses());
  const [services, setServices] = useState<Service[]>(getServices());
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [reviews, setReviews] = useState<Review[]>(getReviews());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotifications());

  // Navigation View State
  const [currentView, setCurrentView] = useState<
    'landing' | 'explore' | 'customer_dashboard' | 'business_dashboard' | 'how_it_works' | 'about'
  >(() => {
    const user = getCurrentUser();
    if (user?.role === 'BUSINESS') return 'business_dashboard';
    if (user?.role === 'USER') return 'customer_dashboard';
    return 'landing';
  });

  // Category filter state when switching to explore
  const [selectedExploreCategory, setSelectedExploreCategory] = useState<BusinessCategory | 'All'>('All');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedBusinessForDetail, setSelectedBusinessForDetail] = useState<Business | null>(null);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [viewTicketAppt, setViewTicketAppt] = useState<Appointment | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    setCurrentUser(currentUserState);
  }, [currentUserState]);

  // Protect dashboard views: auto-redirect if unauthenticated
  useEffect(() => {
    if (!currentUserState && (currentView === 'customer_dashboard' || currentView === 'business_dashboard')) {
      setCurrentView('landing');
    }
  }, [currentUserState, currentView]);

  useEffect(() => { saveUsers(users); }, [users]);
  useEffect(() => { saveBusinesses(businesses); }, [businesses]);
  useEffect(() => { saveServices(services); }, [services]);
  useEffect(() => { saveAppointments(appointments); }, [appointments]);
  useEffect(() => { saveReviews(reviews); }, [reviews]);
  useEffect(() => { saveNotifications(notifications); }, [notifications]);

  // Auth Handlers
  const handleLogin = (user: UserAccount) => {
    setCurrentUserState(user);
    if (user.role === 'BUSINESS') {
      setCurrentView('business_dashboard');
    } else {
      setCurrentView('customer_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUserState(null);
    setCurrentView('landing');
  };

  const handleRegisterUser = (data: { name: string; email: string; phone: string }) => {
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUserState(newUser);
    setCurrentView('customer_dashboard');
  };

  const handleRegisterBusiness = (
    businessData: Omit<Business, 'id' | 'rating' | 'reviewsCount'>,
    servicesData: Omit<Service, 'id' | 'businessId'>[],
    ownerData: { name: string; email: string; phone: string }
  ) => {
    const newBizId = Date.now();
    const newOwnerId = `usr-${Date.now()}`;

    const newOwner: UserAccount = {
      id: newOwnerId,
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      role: 'BUSINESS',
      businessId: newBizId,
      createdAt: new Date().toISOString()
    };

    const newBusiness: Business = {
      ...businessData,
      id: newBizId,
      ownerUserId: newOwnerId,
      rating: 5.0,
      reviewsCount: 1
    };

    const newServices: Service[] = servicesData.map((s, idx) => ({
      ...s,
      id: newBizId + idx + 10,
      businessId: newBizId
    }));

    setUsers(prev => [...prev, newOwner]);
    setBusinesses(prev => [...prev, newBusiness]);
    setServices(prev => [...prev, ...newServices]);

    setCurrentUserState(newOwner);
    setCurrentView('business_dashboard');
  };

  // Booking Creation
  const handleBookAppointment = (data: {
    business: Business;
    service: Service;
    date: string;
    time: string;
    notes?: string;
  }) => {
    if (!currentUserState) {
      setAuthModalOpen(true);
      return;
    }

    const apptId = `APPT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAppointment: Appointment = {
      id: apptId,
      userId: currentUserState.id,
      userName: currentUserState.name,
      userEmail: currentUserState.email,
      userPhone: currentUserState.phone,
      businessId: data.business.id,
      businessName: data.business.name,
      serviceId: data.service.id,
      serviceName: data.service.name,
      date: data.date,
      time: data.time,
      status: 'Booked',
      price: data.service.price,
      duration: data.service.duration,
      notes: data.notes,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUserState.id,
      title: 'Appointment Confirmed',
      message: `Your appointment for ${data.service.name} at ${data.business.name} is scheduled for ${data.date} at ${data.time}.`,
      time: 'Just now',
      read: false,
      type: 'booking'
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Appointment Actions
  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled' as const } : a));

    if (currentUserState) {
      const cancelNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUserState.id,
        title: 'Appointment Cancelled',
        message: `Your appointment ID ${appointmentId} was successfully cancelled.`,
        time: 'Just now',
        read: false,
        type: 'cancellation'
      };
      setNotifications(prev => [cancelNotif, ...prev]);
    }
  };

  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, date: newDate, time: newTime } : a));

    if (currentUserState) {
      const reschedNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUserState.id,
        title: 'Appointment Rescheduled',
        message: `Your appointment ID ${appointmentId} has been moved to ${newDate} at ${newTime}.`,
        time: 'Just now',
        read: false,
        type: 'reschedule'
      };
      setNotifications(prev => [reschedNotif, ...prev]);
    }
  };

  // Business Admin Management
  const handleUpdateBusiness = (updated: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleAddService = (newSvc: Omit<Service, 'id' | 'businessId'>) => {
    if (!currentUserState?.businessId) return;
    const newServiceObj: Service = {
      ...newSvc,
      id: Date.now(),
      businessId: currentUserState.businessId
    };
    setServices(prev => [...prev, newServiceObj]);
  };

  const handleUpdateService = (updated: Service) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteService = (serviceId: number) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleUpdateAppointmentStatus = (appointmentId: string, status: 'Booked' | 'Completed' | 'Cancelled') => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
  };

  // Find business for currently logged in business owner
  const myBusiness = businesses.find(b => b.ownerUserId === currentUserState?.id || b.id === currentUserState?.businessId) || businesses[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* ROUTING VIEW LOGIC */}
      {currentView === 'landing' && (
        <LandingPage
          onOpenAuth={(mode) => setAuthModalOpen(true)}
          onExploreServices={(category) => {
            setSelectedExploreCategory(category || 'All');
            setCurrentView('explore');
          }}
          onHowItWorks={() => {
            const el = document.getElementById('how-it-works-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onAbout={() => {
            setCurrentView('explore');
          }}
        />
      )}

      {currentView === 'explore' && (
        <ExploreServices
          businesses={businesses}
          services={services}
          initialCategory={selectedExploreCategory}
          currentUser={currentUserState}
          onSelectBusiness={(biz) => setSelectedBusinessForDetail(biz)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onGoToDashboard={() => {
            if (!currentUserState) setAuthModalOpen(true);
            else if (currentUserState.role === 'BUSINESS') setCurrentView('business_dashboard');
            else setCurrentView('customer_dashboard');
          }}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'customer_dashboard' && currentUserState?.role === 'USER' && (
        <CustomerDashboard
          currentUser={currentUserState}
          appointments={appointments}
          notifications={notifications}
          businesses={businesses}
          onLogout={handleLogout}
          onExploreServices={() => setCurrentView('explore')}
          onCancelAppointment={handleCancelAppointment}
          onRescheduleAppointment={(appt) => setReschedulingAppt(appt)}
          onViewDetails={(appt) => setViewTicketAppt(appt)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />
      )}

      {currentView === 'business_dashboard' && currentUserState?.role === 'BUSINESS' && (
        <BusinessDashboard
          currentUser={currentUserState}
          business={myBusiness}
          services={services}
          appointments={appointments}
          onUpdateBusiness={handleUpdateBusiness}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onLogout={handleLogout}
        />
      )}

      {(currentView === 'customer_dashboard' || currentView === 'business_dashboard') && !currentUserState && (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              🔒
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Sign In Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              You must be logged in to access the dashboard. Please sign in or create an account to view your appointments and settings.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Return to Landing Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTH POPUP MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegisterUser={handleRegisterUser}
        onRegisterBusiness={handleRegisterBusiness}
        users={users}
      />

      {/* SERVICE DETAIL & BOOKING MODAL */}
      <ServiceDetailModal
        business={selectedBusinessForDetail}
        services={services}
        appointments={appointments}
        reviews={reviews}
        currentUser={currentUserState}
        onClose={() => setSelectedBusinessForDetail(null)}
        onBookAppointment={handleBookAppointment}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* RESCHEDULE MODAL */}
      <RescheduleModal
        appointment={reschedulingAppt}
        business={businesses.find(b => b.id === reschedulingAppt?.businessId)}
        allAppointments={appointments}
        onClose={() => setReschedulingAppt(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* NOTIFICATION CENTER DRAWER */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        notifications={notifications.filter(n => n.userId === currentUserState?.id)}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllAsRead={() => {
          if (currentUserState) {
            setNotifications(prev => prev.map(n => n.userId === currentUserState.id ? { ...n, read: true } : n));
          }
        }}
      />

      {/* VIEW TICKET MODAL */}
      {viewTicketAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs">Appointment Ticket Pass</span>
              <button onClick={() => setViewTicketAppt(null)} className="text-slate-400 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="text-indigo-400 font-extrabold text-sm">ID: {viewTicketAppt.id}</div>
              <div>Service: <strong className="text-white">{viewTicketAppt.serviceName}</strong></div>
              <div>Provider: {viewTicketAppt.businessName}</div>
              <div>Scheduled: {viewTicketAppt.date} at {viewTicketAppt.time}</div>
              <div>Status: <span className="text-emerald-400 font-bold">{viewTicketAppt.status}</span></div>
            </div>

            <button
              onClick={() => setViewTicketAppt(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* AI CHATBOT ASSISTANT */}
      <GeminiChatbot />

    </div>
  );
}
