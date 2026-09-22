import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  PlusCircle,
  ChevronRight,
  Filter,
  Phone,
  Building2,
  FileText
} from 'lucide-react';
import { Appointment, UserAccount, NotificationItem, Business } from '../types';

interface CustomerDashboardProps {
  currentUser: UserAccount;
  appointments: Appointment[];
  notifications: NotificationItem[];
  businesses: Business[];
  onLogout: () => void;
  onExploreServices: () => void;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
  onOpenNotifications: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  appointments,
  notifications,
  businesses,
  onLogout,
  onExploreServices,
  onCancelAppointment,
  onRescheduleAppointment,
  onViewDetails,
  onOpenNotifications
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // User's appointments
  const myAppointments = appointments.filter(a => a.userId === currentUser.id);

  // Next upcoming
  const nextAppointment = myAppointments.find(a => a.status === 'Booked');

  // Filtered list
  const filteredAppointments = myAppointments.filter(a => {
    if (filterTab === 'Upcoming') return a.status === 'Booked';
    if (filterTab === 'Completed') return a.status === 'Completed';
    if (filterTab === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={onExploreServices}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">AppointmentHub</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button onClick={onExploreServices} className="hover:text-indigo-600">
                Explore Services
              </button>
              <button className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">
                My Appointments
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">{currentUser.name}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-lg">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Welcome back, {currentUser.name} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage your upcoming service bookings and review past visit receipts.
            </p>
          </div>

          <button
            onClick={onExploreServices}
            className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book an Appointment</span>
          </button>
        </div>

        {/* Highlighted Next Appointment Card */}
        {nextAppointment ? (
          <div className="p-6 rounded-3xl bg-white border-2 border-indigo-500/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                  Next Upcoming Appointment
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  ID: {nextAppointment.id}
                </span>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Booked & Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Service & Provider</span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">{nextAppointment.serviceName}</span>
                <span className="text-slate-600 font-medium">{nextAppointment.businessName}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Scheduled Time</span>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm mt-0.5">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{nextAppointment.date}</span>
                  <Clock className="w-4 h-4 text-indigo-600 ml-1" />
                  <span>{nextAppointment.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 md:pt-0">
                <button
                  onClick={() => onRescheduleAppointment(nextAppointment)}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Reschedule
                </button>

                <button
                  onClick={() => setConfirmCancelId(nextAppointment.id)}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  onClick={() => onViewDetails(nextAppointment)}
                  className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  View Ticket
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-2 py-8">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No Upcoming Appointments</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any pending bookings right now. Explore available businesses to schedule your next appointment.
            </p>
            <button
              onClick={onExploreServices}
              className="mt-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5"
            >
              <span>Explore Services</span>
            </button>
          </div>
        )}

        {/* Appointments Table / List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              My Booking History
            </h2>

            {/* Filter Tabs */}
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold self-start sm:self-auto">
              {(['Upcoming', 'Completed', 'Cancelled', 'All'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filterTab === tab
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              No appointments found in "{filterTab}" status.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map(appt => (
                <div
                  key={appt.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{appt.serviceName}</span>
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        appt.status === 'Booked' ? 'bg-indigo-50 text-indigo-700' :
                        appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-3">
                      <span>Provider: <strong className="text-slate-800">{appt.businessName}</strong></span>
                      <span>• ID: {appt.id}</span>
                      <span>• ₹{appt.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right sm:text-right text-slate-600 font-medium">
                      <div className="font-bold text-slate-800">{appt.date}</div>
                      <div>{appt.time}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewDetails(appt)}
                        className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        Details
                      </button>

                      {appt.status === 'Booked' && (
                        <button
                          onClick={() => setConfirmCancelId(appt.id)}
                          className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </main>

      {/* Cancellation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Cancel Appointment?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel this appointment? This action will free up the time slot for other customers.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  onCancelAppointment(confirmCancelId);
                  setConfirmCancelId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          AppointmentHub Customer Workspace • Signed in as {currentUser.email}
        </div>
      </footer>

    </div>
  );
};
