import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Appointment, Business } from '../types';
import { generateTimeSlotsForBusinessDate } from '../utils/storage';

interface RescheduleModalProps {
  appointment: Appointment | null;
  business: Business | undefined;
  allAppointments: Appointment[];
  onClose: () => void;
  onConfirmReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  business,
  allAppointments,
  onClose,
  onConfirmReschedule
}) => {
  if (!appointment || !business) return null;

  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState<string | null>(null);

  const availableSlots = generateTimeSlotsForBusinessDate(business, newDate, allAppointments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime) {
      onConfirmReschedule(appointment.id, newDate, newTime);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">{appointment.serviceName} at {business.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select New Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setNewTime(null);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Available Time Slot</label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {availableSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setNewTime(slot.time)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    !slot.available
                      ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      : newTime === slot.time
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTime}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md disabled:opacity-50"
            >
              Confirm Reschedule
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
