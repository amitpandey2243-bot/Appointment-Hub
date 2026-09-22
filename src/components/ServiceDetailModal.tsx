import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { Business, Service, Appointment, UserAccount, Review } from '../types';
import { generateTimeSlotsForBusinessDate } from '../utils/storage';

interface ServiceDetailModalProps {
  business: Business | null;
  services: Service[];
  appointments: Appointment[];
  reviews: Review[];
  currentUser: UserAccount | null;
  onClose: () => void;
  onBookAppointment: (data: {
    business: Business;
    service: Service;
    date: string;
    time: string;
    notes?: string;
  }) => void;
  onOpenAuth: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  business,
  services,
  appointments,
  reviews,
  currentUser,
  onClose,
  onBookAppointment,
  onOpenAuth
}) => {
  if (!business) return null;

  const bizServices = services.filter(s => s.businessId === business.id && s.status === 'Active');
  const bizReviews = reviews.filter(r => r.businessId === business.id);

  // Booking Flow State (Step 1: Service Select -> Step 2: Date & Time -> Step 3: Details & Confirmation -> Step 4: Success Pass)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(bizServices[0] || null);

  // Date selection (defaults to tomorrow's date)
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowStr());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [confirmedApptId, setConfirmedApptId] = useState<string>('');

  // Dynamically generate time slots based on business working hours & booked slots
  const availableSlots = generateTimeSlotsForBusinessDate(business, selectedDate, appointments);

  const handleConfirmBooking = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!selectedService || !selectedTimeSlot) return;

    onBookAppointment({
      business,
      service: selectedService,
      date: selectedDate,
      time: selectedTimeSlot,
      notes: bookingNotes
    });

    const mockId = `APPT-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmedApptId(mockId);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white">
              {business.name.charAt(0)}
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider">
                {business.category}
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                {business.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{business.address}, {business.city}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Select a Service</h3>
                <p className="text-xs text-slate-500">Choose the service you would like to book an appointment for.</p>
              </div>

              <div className="space-y-3">
                {bizServices.map(svc => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      selectedService?.id === svc.id
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span>{svc.name}</span>
                        {selectedService?.id === svc.id && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{svc.description}</p>
                      <div className="text-[11px] text-slate-500 font-medium">Duration: {svc.duration} mins</div>
                    </div>

                    <span className="text-sm font-black text-slate-900 shrink-0">
                      ₹{svc.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reviews Preview */}
              {bizReviews.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800">Customer Reviews ({bizReviews.length})</span>
                  <div className="space-y-2">
                    {bizReviews.map(r => (
                      <div key={r.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{r.userName}</span>
                          <span className="text-amber-500 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500" /> {r.rating}
                          </span>
                        </div>
                        <p className="text-slate-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Next: Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOT SELECTION */}
          {step === 2 && selectedService && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Select Date & Time Slot</h3>
                  <p className="text-xs text-slate-500">Selected Service: <strong>{selectedService.name}</strong> (₹{selectedService.price})</p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Change Service
                </button>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedTimeSlot(null);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Generated Available Slots Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Available Slots for {selectedDate}
                </label>

                {availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                    The business is closed on this date according to working hours. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                          !slot.available
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                            : selectedTimeSlot === slot.time
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>

                <button
                  type="button"
                  disabled={!selectedTimeSlot}
                  onClick={() => setStep(3)}
                  className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Next: Review & Confirm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS REVIEW & CONFIRM */}
          {step === 3 && selectedService && selectedTimeSlot && (
            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Confirm Appointment Details</h3>
                <p className="text-xs text-slate-500">Please review your booking information before confirming.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Business</span>
                  <span className="font-bold text-white">{business.name}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Service</span>
                  <span className="font-bold text-white">{selectedService.name}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="font-bold text-indigo-300">{selectedDate} at {selectedTimeSlot}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Total Price</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{selectedService.price}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any specific symptoms or requests for the provider..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {!currentUser && (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                  Note: You are currently unauthenticated. Clicking confirm will prompt you to sign in or create an account.
                </div>
              )}

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="py-2.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS PASS */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">Your booking reference ID is <strong>{confirmedApptId}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-700 max-w-sm mx-auto text-left">
                <div><strong>Service:</strong> {selectedService?.name}</div>
                <div><strong>Provider:</strong> {business.name}</div>
                <div><strong>Scheduled:</strong> {selectedDate} at {selectedTimeSlot}</div>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Go to My Appointments
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
