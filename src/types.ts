export type UserRole = 'USER' | 'BUSINESS';

export type BusinessCategory =
  | 'Healthcare'
  | 'Education'
  | 'Beauty & Salon'
  | 'Fitness & Wellness'
  | 'Consulting'
  | 'Technology & Repair'
  | 'Legal'
  | 'Automotive'
  | 'Personal Services'
  | 'Other';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessId?: number;
  createdAt: string;
}

export interface Service {
  id: number;
  businessId: number;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number; // in currency ₹
  category: string;
  status: 'Active' | 'Inactive';
}

export interface Business {
  id: number;
  ownerUserId?: string;
  name: string;
  category: BusinessCategory;
  description: string;
  phone: string;
  email: string;
  website?: string;
  locationType: 'physical' | 'online' | 'both';
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  image: string;
  rating: number;
  reviewsCount: number;
  status: 'Active' | 'Inactive';
  workingDays: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  openingTime: string; // e.g. "09:00 AM"
  closingTime: string; // e.g. "05:00 PM"
  slotDuration: number; // in minutes e.g. 30
  subscriptionPlan?: 'Free' | 'Pro' | 'Enterprise';
  isFeatured?: boolean;
  subscriptionExpiresAt?: string;
}

export interface Appointment {
  id: string; // e.g. "APPT-84920"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  businessId: number;
  businessName: string;
  serviceId: number;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  status: 'Booked' | 'Completed' | 'Cancelled';
  price: number;
  duration: number;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: number;
  businessId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'cancellation' | 'reschedule' | 'reminder';
}
