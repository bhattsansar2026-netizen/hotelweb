import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { RESTAURANT_CONTACT_INFO } from '../data/menuData';
import { MenuSectionType } from '../types/restaurant';
import { PalaceLogo } from './PalaceLogo';

interface Props {
  onSelectMenuSection: (section: MenuSectionType) => void;
  onOpenExplore: (tab: 'gallery' | 'buffet_vs_thali') => void;
  onOpenCatering: () => void;
  onOpenVisitUs: (tab: 'location' | 'about_us') => void;
  onOpenHelp: (tab: 'faqs' | 'contact' | 'careers' | 'allergen_guide') => void;
  onOpenReservations: () => void;
  onOpenCallToOrder: () => void;
}

export const Footer: React.FC<Props> = ({
  onSelectMenuSection,
  onOpenExplore,
  onOpenCatering,
  onOpenVisitUs,
  onOpenHelp,
  onOpenReservations,
  onOpenCallToOrder
}) => {
  const handleMenuClick = (sec: MenuSectionType) => {
    onSelectMenuSection(sec);
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-stone-950 text-stone-300 border-t border-stone-800 font-sans-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <PalaceLogo size="md" />
              <div className="flex flex-col">
                <span className="text-xl font-serif-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300">
                  Shankar Restaurant
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-500/80 font-medium">
                  Royal Palace & Indian Dining
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Authentic Indian royal fine dining inspired by centuries of culinary craftsmanship.
              Tandoori charcoal specialties, slow-simmered handi curries, and handcrafted botanical cocktails.
            </p>

            <div className="space-y-2 text-xs text-stone-400 pt-2 border-t border-stone-900">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{RESTAURANT_CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a
                  href={`tel:${RESTAURANT_CONTACT_INFO.phonePrimary.replace(/\s+/g, '')}`}
                  className="hover:text-amber-400 font-mono"
                >
                  {RESTAURANT_CONTACT_INFO.phonePrimary} / {RESTAURANT_CONTACT_INFO.phoneDirect}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily: {RESTAURANT_CONTACT_INFO.hours.lunch} & {RESTAURANT_CONTACT_INFO.hours.dinner}</span>
              </div>
            </div>
          </div>

          {/* Menus Col */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-stone-800 pb-2">
              Menus
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => handleMenuClick('all_day')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  All Day Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('lunch')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Lunch Specials & Thalis
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleMenuClick('bar')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Bar Menu & Spirits
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenCallToOrder}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call to Order</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Explore & Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-stone-800 pb-2">
              Explore & Book
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onOpenExplore('gallery')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenExplore('buffet_vs_thali')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Buffet vs. Thali
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReservations}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Table Reservations
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCatering}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Catering Packages
                </button>
              </li>
            </ul>
          </div>

          {/* Visit Us & Help */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-stone-800 pb-2">
              Visit & Help
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onOpenVisitUs('location')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Location & Directions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenVisitUs('about_us')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  About Our Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelp('faqs')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelp('contact')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Contact Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelp('careers')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenHelp('allergen_guide')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Allergen Matrix Guide
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Shankar Restaurant (Denver Spice Room inspired). All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>FSSAI Lic: 13320001000842</span>
            <span>·</span>
            <span>Outer Circle, Connaught Place, New Delhi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
