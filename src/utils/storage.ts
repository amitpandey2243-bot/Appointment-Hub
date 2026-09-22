import { 
  UserAccount, 
  Business, 
  Service, 
  Appointment, 
  Review, 
  NotificationItem 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_BUSINESSES, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

const KEYS = {
  CURRENT_USER: 'appointmenthub_current_user_v2',
  USERS: 'appointmenthub_users_v2',
  BUSINESSES: 'appointmenthub_businesses_v2',
  SERVICES: 'appointmenthub_services_v2',
  APPOINTMENTS: 'appointmenthub_appointments_v2',
  REVIEWS: 'appointmenthub_reviews_v2',
  NOTIFICATIONS: 'appointmenthub_notifications_v2',
};

// --- AUTH & USERS ---
export function getCurrentUser(): UserAccount | null {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

export function getUsers(): UserAccount[] {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

// --- BUSINESSES ---
export function getBusinesses(): Business[] {
  try {
    const data = localStorage.getItem(KEYS.BUSINESSES);
    if (!data) {
      localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      return INITIAL_BUSINESSES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BUSINESSES;
  }
}

export function saveBusinesses(businesses: Business[]): void {
  try {
    localStorage.setItem(KEYS.BUSINESSES, JSON.stringify(businesses));
  } catch (e) {
    console.error('Failed to save businesses', e);
  }
}

// --- SERVICES ---
export function getServices(): Service[] {
  try {
    const data = localStorage.getItem(KEYS.SERVICES);
    if (!data) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_SERVICES;
  }
}

export function saveServices(services: Service[]): void {
  try {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
  } catch (e) {
    console.error('Failed to save services', e);
  }
}

// --- APPOINTMENTS ---
export function getAppointments(): Appointment[] {
  try {
    const data = localStorage.getItem(KEYS.APPOINTMENTS);
    if (!data) {
      localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
      return INITIAL_APPOINTMENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_APPOINTMENTS;
  }
}

export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (e) {
    console.error('Failed to save appointments', e);
  }
}

// --- REVIEWS ---
export function getReviews(): Review[] {
  try {
    const data = localStorage.getItem(KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function saveReviews(reviews: Review[]): void {
  try {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Failed to save reviews', e);
  }
}

// --- NOTIFICATIONS ---
export function getNotifications(): NotificationItem[] {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: NotificationItem[]): void {
  try {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

// --- RESET UTILITY ---
export function resetDataToDefaults(): void {
  localStorage.removeItem(KEYS.CURRENT_USER);
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.BUSINESSES);
  localStorage.removeItem(KEYS.SERVICES);
  localStorage.removeItem(KEYS.APPOINTMENTS);
  localStorage.removeItem(KEYS.REVIEWS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
}

// --- SLOT GENERATION ENGINE ---
// Generates standard time slots based on a business's working hours, slot duration, and working days
export function generateTimeSlotsForBusinessDate(
  business: Business,
  dateStr: string,
  existingAppointments: Appointment[],
  serviceId?: number
): { time: string; available: boolean; bookedReason?: string }[] {
  const d = new Date(dateStr + 'T00:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

  // Check if business works on this day
  if (!business.workingDays.includes(dayName)) {
    return [];
  }

  // Helper to parse "09:00 AM" into minutes from midnight
  const parseTimeToMinutes = (tStr: string): number => {
    const [time, modifier] = tStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const formatMinutesToTime = (totalMin: number): string => {
    let hours = Math.floor(totalMin / 60);
    const minutes = totalMin % 60;
    const modifier = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hoursStr}:${minStr} ${modifier}`;
  };

  const startMin = parseTimeToMinutes(business.openingTime);
  const endMin = parseTimeToMinutes(business.closingTime);
  const step = business.slotDuration || 30;

  const slots: { time: string; available: boolean; bookedReason?: string }[] = [];

  // Booked times on dateStr for this business
  const bookedTimesOnDate = existingAppointments
    .filter(a => a.businessId === business.id && a.date === dateStr && a.status === 'Booked')
    .map(a => a.time);

  for (let m = startMin; m + step <= endMin; m += step) {
    const timeLabel = formatMinutesToTime(m);
    const isBooked = bookedTimesOnDate.includes(timeLabel);

    slots.push({
      time: timeLabel,
      available: !isBooked,
      bookedReason: isBooked ? 'Already Reserved' : undefined
    });
  }

  return slots;
}
