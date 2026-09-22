import { Business, Service, Appointment, Review, NotificationItem, UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Rahul Sharma',
    email: 'user@appointmenthub.com',
    phone: '+91 98765 43210',
    role: 'USER',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Dr. Ananya Roy (CityCare)',
    email: 'business@appointmenthub.com',
    phone: '+91 91234 56789',
    role: 'BUSINESS',
    businessId: 1,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 1,
    ownerUserId: 'usr-2',
    name: "CityCare Multispecialty Clinic",
    category: "Healthcare",
    description: "Modern medical healthcare facility offering general physician consultations, specialist doctor diagnosis, preventive health checkups, and diagnostic lab bookings.",
    phone: "+91 522 2623400",
    email: "contact@citycareclinic.org",
    website: "https://citycareclinic.org",
    locationType: "physical",
    address: "12/A Hazratganj Main Road",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
    country: "India",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    reviewsCount: 94,
    status: "Active",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    openingTime: "08:00 AM",
    closingTime: "06:00 PM",
    slotDuration: 30,
    subscriptionPlan: "Pro",
    isFeatured: true
  },
  {
    id: 2,
    name: "Style Studio Salon & Spa",
    category: "Beauty & Salon",
    description: "Professional hair styling, precision cuts, bridal transformations, skincare facials, and relaxing wellness spa treatments.",
    phone: "+91 522 4018899",
    email: "info@stylestudiosalon.com",
    website: "https://stylestudiosalon.com",
    locationType: "physical",
    address: "B-4 Gomti Nagar Vibhuti Khand",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
    country: "India",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    reviewsCount: 76,
    status: "Active",
    workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    openingTime: "10:00 AM",
    closingTime: "08:00 PM",
    slotDuration: 45
  },
  {
    id: 3,
    name: "TechFix Electronics Lab",
    category: "Technology & Repair",
    description: "Certified computer & smartphone repair hub specializing in fast laptop diagnostics, chip-level motherboard repair, screen replacements, and data recovery.",
    phone: "+91 522 2459012",
    email: "support@techfixlab.in",
    website: "https://techfixlab.in",
    locationType: "both",
    address: "Shop 18, Computer Market, Alambagh",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226005",
    country: "India",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewsCount: 112,
    status: "Active",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    openingTime: "10:00 AM",
    closingTime: "07:00 PM",
    slotDuration: 30
  },
  {
    id: 4,
    name: "Apex Education & Career Counseling",
    category: "Education",
    description: "Guidance center offering student academic counseling, university admissions advice, entrance exam preparation strategies, and scholarship assistance.",
    phone: "+91 522 2781100",
    email: "counseling@apexedu.org",
    website: "https://apexedu.org",
    locationType: "both",
    address: "Plot 45, Indiranagar Sector 11",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226016",
    country: "India",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    reviewsCount: 88,
    status: "Active",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    slotDuration: 30
  },
  {
    id: 5,
    name: "FitZone Gym & Yoga Arena",
    category: "Fitness & Wellness",
    description: "Modern fitness facility equipped with state-of-the-art strength gear, 1-on-1 personal training, group yoga sessions, and posture therapy.",
    phone: "+91 522 2381122",
    email: "fitness@fitzonegym.com",
    website: "https://fitzonegym.com",
    locationType: "physical",
    address: "Sector 14 Mahanagar",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226006",
    country: "India",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    reviewsCount: 53,
    status: "Active",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    openingTime: "06:00 AM",
    closingTime: "09:00 PM",
    slotDuration: 60
  }
];

export const INITIAL_SERVICES: Service[] = [
  // CityCare Healthcare Services (ID 1)
  {
    id: 1,
    businessId: 1,
    name: "General Physician Consultation",
    description: "Thorough clinical examination, symptom evaluation, prescription drafting, and preventive health advice.",
    duration: 30,
    price: 500,
    category: "Medical",
    status: "Active"
  },
  {
    id: 2,
    businessId: 1,
    name: "Full Body Health Checkup",
    description: "Blood glucose, CBC, lipid profile, thyroid check, ECG, and detailed doctor consultation.",
    duration: 45,
    price: 1499,
    category: "Diagnostics",
    status: "Active"
  },

  // Style Studio Salon Services (ID 2)
  {
    id: 3,
    businessId: 2,
    name: "Hair Cut & Blow Dry Styling",
    description: "Custom haircut consultation, hair wash, scalp massage, and precision styling.",
    duration: 45,
    price: 450,
    category: "Grooming",
    status: "Active"
  },
  {
    id: 4,
    businessId: 2,
    name: "Deep Cleansing Organic Facial",
    description: "Exfoliating herbal scrub, steam extraction, face mask, and neck massage.",
    duration: 60,
    price: 899,
    category: "Skincare",
    status: "Active"
  },

  // TechFix Repair Services (ID 3)
  {
    id: 5,
    businessId: 3,
    name: "Laptop Diagnostic & Hardware Repair",
    description: "Diagnostic check for booting issues, overheating, RAM upgrade, or motherboard repairs.",
    duration: 30,
    price: 350,
    category: "Hardware",
    status: "Active"
  },
  {
    id: 6,
    businessId: 3,
    name: "Smartphone Screen Replacement",
    description: "Genuine display glass assembly swap with 90-day warranty coverage.",
    duration: 45,
    price: 1200,
    category: "Mobile",
    status: "Active"
  },

  // Apex Education Services (ID 4)
  {
    id: 7,
    businessId: 4,
    name: "1-on-1 Career Counseling Session",
    description: "Personalized course selection advice, resume building, and university application guidance.",
    duration: 30,
    price: 0,
    category: "Counseling",
    status: "Active"
  },

  // FitZone Fitness Services (ID 5)
  {
    id: 8,
    businessId: 5,
    name: "Personal Fitness Assessment & Consultation",
    description: "Body composition analysis, goal setting, customized workout plan, and posture check.",
    duration: 60,
    price: 600,
    category: "Fitness",
    status: "Active"
  }
];

// Helper to get formatted date string YYYY-MM-DD
function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APPT-90112',
    userId: 'usr-1',
    userName: 'Rahul Sharma',
    userEmail: 'user@appointmenthub.com',
    userPhone: '+91 98765 43210',
    businessId: 1,
    businessName: 'CityCare Multispecialty Clinic',
    serviceId: 1,
    serviceName: 'General Physician Consultation',
    date: getFutureDate(1),
    time: '10:00 AM',
    status: 'Booked',
    price: 500,
    duration: 30,
    notes: 'Seasonal cough and routine blood pressure review.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'APPT-44392',
    userId: 'usr-1',
    userName: 'Rahul Sharma',
    userEmail: 'user@appointmenthub.com',
    userPhone: '+91 98765 43210',
    businessId: 3,
    businessName: 'TechFix Electronics Lab',
    serviceId: 5,
    serviceName: 'Laptop Diagnostic & Hardware Repair',
    date: getFutureDate(3),
    time: '02:00 PM',
    status: 'Booked',
    price: 350,
    duration: 30,
    notes: 'Laptop battery draining fast.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'APPT-10023',
    userId: 'usr-1',
    userName: 'Rahul Sharma',
    userEmail: 'user@appointmenthub.com',
    userPhone: '+91 98765 43210',
    businessId: 2,
    businessName: 'Style Studio Salon & Spa',
    serviceId: 3,
    serviceName: 'Hair Cut & Blow Dry Styling',
    date: getFutureDate(-2),
    time: '11:30 AM',
    status: 'Completed',
    price: 450,
    duration: 45,
    notes: 'Standard hair wash and cut.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    businessId: 1,
    userId: 'usr-1',
    userName: 'Priya Verma',
    rating: 5,
    comment: 'Very professional clinic. Dr. Ananya was thorough and diagnosed my issue quickly.',
    date: '2 days ago'
  },
  {
    id: 2,
    businessId: 2,
    userId: 'usr-1',
    userName: 'Siddharth Roy',
    rating: 5,
    comment: 'Great hair cut experience! Friendly staff and clean environment.',
    date: '4 days ago'
  },
  {
    id: 3,
    businessId: 3,
    userId: 'usr-1',
    userName: 'Amit Srivastava',
    rating: 5,
    comment: 'Repaired my laptop screen in under 2 hours. Honest pricing.',
    date: '1 week ago'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: 'Appointment Confirmed',
    message: 'Your General Physician Consultation at CityCare Clinic is scheduled for tomorrow at 10:00 AM.',
    time: '1 hour ago',
    read: false,
    type: 'booking'
  }
];
