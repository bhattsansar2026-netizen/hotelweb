import React from 'react';
import { Phone, ShoppingBag, ArrowRight } from 'lucide-react';

interface Props {
  cartCount: number;
  cartTotal: number;
  isCartBouncing: boolean;
  onOpenCallToOrder: () => void;
  onOpenOrderNow: () => void;
}

export const FloatingActionButtons: React.FC<Props> = ({
  cartCount,
  cartTotal,
  isCartBouncing,
  onOpenCallToOrder,
  onOpenOrderNow
}) => {
  return (
    <aside
      aria-label="Quick Actions"
      className="hidden md:flex fixed bottom-5 right-5 z-40 items-center gap-2 select-none"
    >
      {/* 1. Call to Order - compact, flexible pill */}
      <button
        type="button"
        onClick={onOpenCallToOrder}
        className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900/90 hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-700/70 shadow-lg hover:shadow-xl hover:border-amber-400/60 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 text-[11px] font-semibold"
        title="Call Shankar Restaurant Directly"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Phone className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
        <span className="tracking-wide">Call to Order</span>
      </button>

      {/* 2. Order Now - compact, flexible CTA */}
      <button
        type="button"
        onClick={onOpenOrderNow}
        className={`group flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 text-[11px] ${
          isCartBouncing ? 'ring-2 ring-amber-300 shadow-xl scale-105' : 'scale-100'
        }`}
        title="Order Food Items Online"
      >
        <ShoppingBag className="w-3.5 h-3.5 text-stone-950 shrink-0" />
        <span className="tracking-wide">Order Now</span>

        {cartCount > 0 ? (
          <span className="flex items-center gap-1 ml-0.5 pl-1.5 border-l border-stone-900/25 font-mono text-[10px] font-black">
            <span className="min-w-4 h-4 px-1 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center text-[9px]">
              {cartCount}
            </span>
            {cartTotal > 0 && <span>₹{cartTotal}</span>}
          </span>
        ) : (
          <ArrowRight className="w-3 h-3 text-stone-950 group-hover:translate-x-0.5 transition-transform shrink-0" />
        )}
      </button>
    </aside>
  );
};
