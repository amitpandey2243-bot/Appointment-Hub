import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Filter, 
  Building2, 
  ArrowLeft,
  User,
  LogOut,
  Bell,
  Crown,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Business, Service, BusinessCategory, UserAccount } from '../types';

interface ExploreServicesProps {
  businesses: Business[];
  services: Service[];
  initialCategory?: BusinessCategory | 'All';
  currentUser: UserAccount | null;
  onSelectBusiness: (business: Business) => void;
  onOpenAuth: () => void;
  onGoToDashboard: () => void;
  onLogout: () => void;
}

const CATEGORY_LIST: Array<BusinessCategory | 'All'> = [
  'All',
  'Healthcare',
  'Beauty & Salon',
  'Technology & Repair',
  'Education',
  'Fitness & Wellness',
  'Consulting',
  'Legal',
  'Automotive',
  'Other'
];

export const ExploreServices: React.FC<ExploreServicesProps> = ({
  businesses,
  services,
  initialCategory = 'All',
  currentUser,
  onSelectBusiness,
  onOpenAuth,
  onGoToDashboard,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'All'>(initialCategory);

  const filteredBusinesses = businesses
    .filter(biz => {
      const matchesCategory = selectedCategory === 'All' || biz.category === selectedCategory;
      
      const bizServices = services.filter(s => s.businessId === biz.id);
      const serviceNames = bizServices.map(s => s.name.toLowerCase()).join(' ');

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        biz.name.toLowerCase().includes(q) || 
        biz.category.toLowerCase().includes(q) || 
        biz.city.toLowerCase().includes(q) || 
        biz.address.toLowerCase().includes(q) || 
        serviceNames.includes(q);

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aFeatured = a.isFeatured || a.subscriptionPlan === 'Pro' || a.subscriptionPlan === 'Enterprise';
      const bFeatured = b.isFeatured || b.subscriptionPlan === 'Pro' || b.subscriptionPlan === 'Enterprise';

      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return b.rating - a.rating;
    });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToDashboard}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">AppointmentHub</span>
            </div>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <button
                    onClick={onGoToDashboard}
                    className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    {currentUser.role === 'BUSINESS' ? 'Business Dashboard' : 'My Appointments'}
                  </button>

                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Sign In / Register
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Search & Header Title */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Local Service Providers
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a business or service provider to choose your appointment slot.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative max-w-2xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, businesses, clinics, salons, or locations..."
              className="w-full bg-white border border-slate-300 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 shadow-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {CATEGORY_LIST.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        {filteredBusinesses.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-2 py-16">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-sm">No Service Providers Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No business matches your search query or selected category filter. Try clearing your search.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map(biz => {
              const bizServices = services.filter(s => s.businessId === biz.id);
              const minPrice = bizServices.length > 0 
                ? Math.min(...bizServices.map(s => s.price)) 
                : 0;

              const isPro = biz.isFeatured || biz.subscriptionPlan === 'Pro' || biz.subscriptionPlan === 'Enterprise';

              return (
                <div
                  key={biz.id}
                  className={`bg-white rounded-3xl transition-all overflow-hidden flex flex-col justify-between group ${
                    isPro 
                      ? 'border-2 border-amber-400 shadow-md hover:shadow-xl ring-2 ring-amber-400/20' 
                      : 'border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md'
                  }`}
                >
                  {/* Card Header Image */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    <img
                      src={biz.image}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {isPro ? (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Crown className="w-3 h-3 fill-slate-950" />
                        <span>TOP FEATURED</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        {biz.category}
                      </div>
                    )}

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{biz.rating}</span>
                      <span className="text-slate-300 font-normal">({biz.reviewsCount})</span>
                    </div>

                    {isPro && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-extrabold uppercase tracking-wider">
                        {biz.category}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {biz.name}
                        </h3>
                        {isPro && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 shrink-0">
                            <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
                            PRO
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.address}, {biz.city}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                        {biz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-600 font-semibold">
                        Starting at <strong className="text-slate-900 font-extrabold">₹{minPrice}</strong>
                      </div>

                      <button
                        onClick={() => onSelectBusiness(biz)}
                        className={`py-2 px-4 rounded-xl text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 ${
                          isPro
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        <span>View Services</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          AppointmentHub • Explore verified local services and providers
        </div>
      </footer>

    </div>
  );
};
