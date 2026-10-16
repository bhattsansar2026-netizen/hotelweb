import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Calendar,
  ShoppingBag,
  User,
  ClipboardList,
  Phone,
  ArrowRight
} from 'lucide-react';
import { UserProfile, GeofenceState } from '../types/restaurant';

interface Props {
  cartCount: number;
  cartTotal: number;
  isCartBouncing: boolean;
  ordersCount: number;
  user: UserProfile;
  geofenceState: GeofenceState;
  activeMenuSection: string;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenReservations: () => void;
  onOpenAuth: () => void;
  onOpenCallToOrder: () => void;
  onScrollToMenu: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  cartCount,
  cartTotal,
  isCartBouncing,
  ordersCount,
  user,
  onOpenCart,
  onOpenOrders,
  onOpenReservations,
  onOpenAuth,
  onOpenCallToOrder,
  onScrollToMenu
}) => {
  const [isMobileUser, setIsMobileUser] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isNarrow = window.innerWidth <= 1024;
    return isMobileUA || isTouch || isNarrow;
  });

  useEffect(() => {
    const handleResize = () => {
      const ua = navigator.userAgent || '';
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
      const isNarrow = window.innerWidth <= 1024;
      setIsMobileUser(isMobileUA || isTouch || isNarrow);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasOrders = user.isLoggedIn && ordersCount > 0;

  // If user is strictly on desktop with wide monitor and no touch/mobile UA, do not render
  if (!isMobileUser) {
    return null;
  }

  return (
    <>
      {/* Floating Mini Cart Bar: Appears right above bottom nav when cart has items */}
      {cartCount > 0 && (
        <aside
          aria-label="Floating Cart Summary"
          className="fixed bottom-[64px] left-3 right-3 z-50 animate-slide-up"
        >
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold px-3.5 py-2.5 rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-between border border-amber-300/70 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center font-mono text-xs font-black shadow-xs">
                {cartCount}
              </div>
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-stone-950 block">
                  {cartCount === 1 ? '1 Dish In Bag' : `${cartCount} Dishes In Bag`}
                </span>
                <span className="text-xs font-mono font-bold text-stone-900">
                  ₹{cartTotal} <span className="text-[10px] font-normal text-stone-800 font-sans-body">plus taxes</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-black bg-stone-950 text-amber-300 px-2.5 py-1.5 rounded-xl shadow-xs">
              <span>View Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </aside>
      )}

      {/* Android/Mobile Bottom Navigation Bar: Permanently fixed at the bottom of the viewport */}
      <nav
        aria-label="Mobile Main Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 text-stone-300 px-1 pt-1.5 pb-1 shadow-2xl select-none"
      >
        <div className="grid grid-cols-5 items-center h-13 max-w-md mx-auto">
          {/* Tab 1: Menu */}
          <button
            type="button"
            onClick={onScrollToMenu}
            className="flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-400 active:text-amber-300 transition-colors cursor-pointer group"
          >
            <Utensils className="w-5 h-5 group-hover:scale-110 transition-transform text-amber-400" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-200">
              Menu
            </span>
          </button>

          {/* Tab 2: Book Table */}
          <button
            type="button"
            onClick={onOpenReservations}
            className="flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-400 active:text-amber-300 transition-colors cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center group-hover:bg-amber-400/25 transition-all">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5 text-amber-300">
              Book Table
            </span>
          </button>

          {/* Tab 3: Call / Concierge */}
          <button
            type="button"
            onClick={onOpenCallToOrder}
            className="flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-400 active:text-amber-300 transition-colors cursor-pointer group"
          >
            <Phone className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-300">
              Call
            </span>
          </button>

          {/* Tab 4: Dining Bag / Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className={`flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-400 active:text-amber-300 transition-colors cursor-pointer group relative ${
              isCartBouncing ? 'scale-110' : ''
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-stone-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-stone-950 font-bold text-[9px] flex items-center justify-center font-mono shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-300">
              {cartTotal > 0 ? `₹${cartTotal}` : 'Bag'}
            </span>
          </button>

          {/* Tab 5: Account or Orders */}
          <button
            type="button"
            onClick={hasOrders ? onOpenOrders : onOpenAuth}
            className="flex flex-col items-center justify-center h-full text-stone-400 hover:text-amber-400 active:text-amber-300 transition-colors cursor-pointer group relative"
          >
            {hasOrders ? (
              <>
                <div className="relative">
                  <ClipboardList className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-bold text-[9px] flex items-center justify-center font-mono">
                    {ordersCount}
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-0.5 text-amber-400">
                  Orders
                </span>
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-stone-300 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium tracking-tight mt-0.5 text-stone-300">
                  {user.isLoggedIn ? 'Profile' : 'Sign In'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Android Native Gesture Pill Bar */}
        <div className="w-24 h-1 bg-stone-700/60 rounded-full mx-auto my-0.5 pointer-events-none" />
      </nav>
    </>
  );
};
