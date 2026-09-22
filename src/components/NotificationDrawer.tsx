import React from 'react';
import { X, Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm">Notification Center</h3>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border text-xs space-y-1 ${
                  n.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
