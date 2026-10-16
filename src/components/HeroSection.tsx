import React from 'react';
import { Clock, MapPin, Sparkles, UtensilsCrossed } from 'lucide-react';
import { BookingType } from '../types/restaurant';
import { RESTAURANT_HERO_IMAGE } from '../data/menuData';

interface Props {
  bookingType: BookingType;
  onChangeBookingType: (type: BookingType) => void;
  onOpenReservations: () => void;
  onScrollToMenu: () => void;
}

export const HeroSection: React.FC<Props> = ({
  bookingType,
  onChangeBookingType,
  onOpenReservations,
  onScrollToMenu
}) => {
  return (
    <section className="relative bg-stone-950 text-stone-100 overflow-hidden font-sans-body">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0">
        <img
          src={RESTAURANT_HERO_IMAGE}
          alt="Shankar Restaurant Grand Royal Dining Interior"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-16 sm:pb-22 lg:pt-22 lg:pb-28">
        <div className="max-w-3xl space-y-3.5 sm:space-y-4">
          {/* Unboxed editorial kicker */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-amber-400 font-semibold flex-wrap">
            <span>Heritage Dining Since 1974</span>
            <span aria-hidden="true">·</span>
            <span>Connaught Place</span>
            <span aria-hidden="true">·</span>
            <span>Royal Mughlai & Tandoor</span>
          </div>

          {/* Main Title with balanced wrapping */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-white tracking-tight leading-[1.18] text-balance">
            Shankar Restaurant: Authenticity, Fire & Royal Flavours
          </h1>

          <p className="text-xs sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            Slow-simmered handi curries, clay-tandoor smoked kebabs, and Awadhi dum biryanis
            crafted under secret family spice formulations.
          </p>

          {/* Compact, refined ordering selector & spacious action buttons with generous spacing down */}
          <div className="pt-4 pb-6 sm:pt-6 sm:pb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
            {/* Slim Segmented Selector */}
            <div className="inline-flex p-1 rounded-xl bg-stone-900/90 border border-stone-800 self-start shadow-xs">
              <button
                type="button"
                onClick={() => onChangeBookingType('delivery')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bookingType === 'delivery'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Delivery
              </button>
              <button
                type="button"
                onClick={() => onChangeBookingType('dine_in')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bookingType === 'dine_in'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Dine-In
              </button>
              <button
                type="button"
                onClick={() => onChangeBookingType('takeaway')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bookingType === 'takeaway'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Takeaway
              </button>
            </div>

            {/* CTA Buttons with ample touch targets & generous spacing down */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onScrollToMenu}
                className="px-5 py-2 text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Order Food
              </button>

              <button
                type="button"
                onClick={onOpenReservations}
                className="px-4 py-2 text-xs sm:text-sm font-medium bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Book Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Craftsmanship Bar */}
      <div className="border-t border-stone-800/80 bg-stone-950/90 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Clay Charcoal Tandoor</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">100% Desi Makhan & Ghee</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">25-35 Min Gourmet Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Connaught Place, New Delhi</span>
          </div>
        </div>
      </div>
    </section>
  );
};
