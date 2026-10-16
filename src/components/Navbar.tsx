import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Phone,
  ClipboardList,
  Utensils,
  Sun,
  Wine,
  Coffee,
  Sparkles,
  Calendar,
  UtensilsCrossed,
  MapPin,
  HelpCircle,
  Briefcase,
  AlertCircle,
  Compass,
  ShoppingBag
} from 'lucide-react';
import { UserProfile, MenuSectionType } from '../types/restaurant';
import { PalaceLogo } from './PalaceLogo';

interface Props {
  cartCount: number;
  cartTotal: number;
  isCartBouncing: boolean;
  ordersCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenReservations: () => void;
  onOpenAuth: () => void;
  onOpenCallToOrder: () => void;
  onOpenExplore: (tab: 'gallery' | 'buffet_vs_thali') => void;
  onOpenCatering: () => void;
  onOpenVisitUs: (tab: 'location' | 'about_us') => void;
  onOpenHelp: (tab: 'faqs' | 'contact' | 'careers' | 'allergen_guide') => void;
  onSelectMenuSection: (section: MenuSectionType) => void;
  user: UserProfile;
}

export const Navbar: React.FC<Props> = ({
  cartCount,
  cartTotal,
  isCartBouncing,
  ordersCount,
  onOpenCart,
  onOpenOrders,
  onOpenReservations,
  onOpenAuth,
  onOpenCallToOrder,
  onOpenExplore,
  onOpenCatering,
  onOpenVisitUs,
  onOpenHelp,
  onSelectMenuSection,
  user
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when user clicks anywhere outside of the nav
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Toggle dropdown on click and hold open
  const handleDropdownToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleMenuClick = (section: MenuSectionType) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onSelectMenuSection(section);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Condition specified by user:
  // "don't show orders section only phone and sign in option and after do sign in and orders something then sign in should disappear and ordered item list should show"
  const hasSignedInAndOrdered = user.isLoggedIn && ordersCount > 0;

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all font-sans-body">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 relative"
        ref={navContainerRef}
      >
        {/* Brand Wordmark (Always on the Left) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 sm:gap-3 group whitespace-nowrap shrink-0"
        >
          <PalaceLogo size="md" />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-serif-display font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 group-hover:from-white group-hover:to-amber-200 transition-all">
              Shankar Restaurant
            </span>
            <span className="text-[9px] uppercase tracking-widest text-amber-500/80 font-medium -mt-0.5 hidden sm:block">
              Royal Palace & Indian Dining
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with Click-to-Hold Dropdown Menus */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold tracking-wide uppercase text-stone-300">
          {/* 1. MENU (3 sub menus: All Day, Lunch, Bar Menu) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleDropdownToggle('menu', e)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                activeDropdown === 'menu'
                  ? 'text-amber-400 bg-stone-800 ring-1 ring-amber-400/40'
                  : 'hover:text-amber-400 hover:bg-stone-800/60'
              }`}
            >
              <span>Menu</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'menu' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {activeDropdown === 'menu' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-60 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 animate-slide-up z-50"
              >
                <button
                  type="button"
                  onClick={() => handleMenuClick('all_day')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">All Day Menu</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Full spread curries, biryani & tandoor
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuClick('lunch')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Lunch Menu</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Royal Thalis, express bowls & kathi wraps
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuClick('bar')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Wine className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Bar Menu</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Smoked craft cocktails, beers & wines
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 2. EXPLORE (Gallery, Buffet vs Thali) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleDropdownToggle('explore', e)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                activeDropdown === 'explore'
                  ? 'text-amber-400 bg-stone-800 ring-1 ring-amber-400/40'
                  : 'hover:text-amber-400 hover:bg-stone-800/60'
              }`}
            >
              <span>Explore</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'explore' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {activeDropdown === 'explore' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-60 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 animate-slide-up z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenExplore('gallery');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Gallery</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Photos of dining hall, tandoor & dishes
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenExplore('buffet_vs_thali');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Buffet vs. Thali</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Ayurvedic Thali vs Weekend Buffet guide
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. QUICK LINKS (Order, Reservations, Catering) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleDropdownToggle('quick_links', e)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                activeDropdown === 'quick_links'
                  ? 'text-amber-400 bg-stone-800 ring-1 ring-amber-400/40'
                  : 'hover:text-amber-400 hover:bg-stone-800/60'
              }`}
            >
              <span>Quick Links</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'quick_links' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {activeDropdown === 'quick_links' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-60 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 animate-slide-up z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenCart();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Order Online</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Immediate takeout & direct delivery
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenReservations();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Reservations</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Book tables in dining hall or baithak
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenCatering();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Catering</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Weddings, corporate & outdoor live tandoor
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. VISIT US (Location, About Us) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleDropdownToggle('visit_us', e)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                activeDropdown === 'visit_us'
                  ? 'text-amber-400 bg-stone-800 ring-1 ring-amber-400/40'
                  : 'hover:text-amber-400 hover:bg-stone-800/60'
              }`}
            >
              <span>Visit Us</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'visit_us' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {activeDropdown === 'visit_us' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-60 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 animate-slide-up z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenVisitUs('location');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Location</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Connaught Place hub, parking & metro
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenVisitUs('about_us');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">About Us</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Our 50-year heritage & culinary ethos
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. HELP (FAQs, Contact, Careers, Allergen Guide) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => handleDropdownToggle('help', e)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer select-none ${
                activeDropdown === 'help'
                  ? 'text-amber-400 bg-stone-800 ring-1 ring-amber-400/40'
                  : 'hover:text-amber-400 hover:bg-stone-800/60'
              }`}
            >
              <span>Help</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeDropdown === 'help' ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {activeDropdown === 'help' && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full left-0 mt-2 w-64 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-2 space-y-1 animate-slide-up z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenHelp('faqs');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">FAQs</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Dietary, parking & reservation answers
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenHelp('contact');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Contact</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Phone concierge & messaging form
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenHelp('careers');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Careers</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Join chefs, mixologists & hospitality team
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenHelp('allergen_guide');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs text-stone-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white">Allergen Guide</span>
                    <span className="text-[10px] text-stone-400 block normal-case font-normal">
                      Gluten, dairy, nut & Jain matrix
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 6. TABLE RESERVATIONS */}
          <button
            type="button"
            onClick={() => {
              setActiveDropdown(null);
              onOpenReservations();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-stone-300 hover:text-amber-400 hover:bg-stone-800/60 transition-colors cursor-pointer select-none"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Book Table</span>
          </button>
        </nav>

        {/* Action Buttons Cluster & Mobile Hamburger on the Right Side */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Phone button: Always visible for direct call */}
          <button
            type="button"
            onClick={onOpenCallToOrder}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-stone-300 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer text-xs font-semibold"
            title="Call Shankar Restaurant"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Call</span>
          </button>

          {/* Conditional Orders vs Sign In Logic */}
          {hasSignedInAndOrdered ? (
            <button
              type="button"
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-400/40 hover:bg-amber-500/25 transition-all text-xs font-bold cursor-pointer"
              title="View Ordered Items List"
            >
              <ClipboardList className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ordered Items</span>
              <span className="ml-1 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] flex items-center justify-center font-mono">
                {ordersCount}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-9 h-9 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-amber-400 border border-stone-700/80 hover:border-amber-400/50 transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95 group"
              title={user.isLoggedIn ? (user.name || 'Member Profile') : 'Account Profile'}
              aria-label="Account Profile"
            >
              {user.isLoggedIn && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-6 h-6 rounded-lg object-cover ring-1 ring-amber-400"
                />
              ) : (
                <User className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              )}
            </button>
          )}

          {/* Mobile Hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Expandable with full submenus) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 p-4 space-y-3 max-h-[80vh] overflow-y-auto animate-slide-up">
          {/* 1. Mobile Menu Section */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileExpanded(mobileExpanded === 'menu' ? null : 'menu')}
              className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold text-amber-400 hover:bg-stone-800 cursor-pointer"
            >
              <span>1. Menu Offerings</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileExpanded === 'menu' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileExpanded === 'menu' && (
              <div className="pl-4 space-y-1 pt-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => handleMenuClick('all_day')}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Day Menu (Curries, Biryani & Tandoor)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMenuClick('lunch')}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lunch Menu (Royal Thalis & Express Bowls)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMenuClick('bar')}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Wine className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bar Menu (Craft Cocktails, Beers & Wines)</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Mobile Explore Section */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileExpanded(mobileExpanded === 'explore' ? null : 'explore')}
              className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold text-stone-200 hover:bg-stone-800 cursor-pointer"
            >
              <span>2. Explore</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileExpanded === 'explore' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileExpanded === 'explore' && (
              <div className="pl-4 space-y-1 pt-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenExplore('gallery');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Visual Photo Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenExplore('buffet_vs_thali');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buffet vs. Thali Guide</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Mobile Quick Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileExpanded(mobileExpanded === 'quick_links' ? null : 'quick_links')}
              className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold text-stone-200 hover:bg-stone-800 cursor-pointer"
            >
              <span>3. Quick Links</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileExpanded === 'quick_links' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileExpanded === 'quick_links' && (
              <div className="pl-4 space-y-1 pt-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Order Online</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReservations();
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Table Reservations</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCatering();
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Catering Packages</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Mobile Visit Us */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileExpanded(mobileExpanded === 'visit_us' ? null : 'visit_us')}
              className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold text-stone-200 hover:bg-stone-800 cursor-pointer"
            >
              <span>4. Visit Us</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileExpanded === 'visit_us' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileExpanded === 'visit_us' && (
              <div className="pl-4 space-y-1 pt-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVisitUs('location');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Location & Hours</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenVisitUs('about_us');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>About Our Heritage</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Mobile Help */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileExpanded(mobileExpanded === 'help' ? null : 'help')}
              className="w-full flex items-center justify-between p-2 rounded-lg text-sm font-bold text-stone-200 hover:bg-stone-800 cursor-pointer"
            >
              <span>5. Help & Guide</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileExpanded === 'help' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {mobileExpanded === 'help' && (
              <div className="pl-4 space-y-1 pt-1 border-l border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHelp('faqs');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>FAQs</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHelp('contact');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Us</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHelp('careers');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Careers</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHelp('allergen_guide');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 flex items-center gap-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Allergen Guide</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Bottom Actions: Phone, Sign In / Ordered Items, Book Table */}
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCallToOrder();
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-750 flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call to Order</span>
              </button>

              {hasSignedInAndOrdered ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrders();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold hover:bg-amber-400/30 flex items-center justify-center gap-2"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ordered Items ({ordersCount})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold hover:bg-amber-300 flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservations();
              }}
              className="w-full py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700 flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Book Table</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
