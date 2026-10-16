import React, { useState } from 'react';
import { X, Flame, Plus, Minus, Star } from 'lucide-react';
import { MenuItem, SpiceLevel } from '../types/restaurant';

interface Props {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    portion: 'full' | 'half',
    spiceLevel: SpiceLevel,
    quantity: number,
    specialInstructions?: string
  ) => void;
}

export const ItemCustomizationModal: React.FC<Props> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen || !item) return null;

  const [portion, setPortion] = useState<'full' | 'half'>('full');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>(item.spiceLevel || 1);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const currentPrice = portion === 'half' && item.halfPrice ? item.halfPrice : item.price;
  const itemTotal = currentPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(item, portion, spiceLevel, quantity, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-sans-body">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        {/* Modal Header Image */}
        <div className="relative h-40 sm:h-48 bg-stone-100 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2.5 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs">
              <span className="capitalize text-stone-200">{item.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif-display font-bold leading-tight">{item.name}</h3>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Portion Selection (if half is available) */}
          {item.halfPrice && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Select Serving Portion
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPortion('full')}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[44px] cursor-pointer ${
                    portion === 'full'
                      ? 'border-amber-900 bg-amber-50 text-stone-900 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Full Serving</span>
                    <span className="font-mono tabular-nums">₹{item.price}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Recommended portion for 2
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortion('half')}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[44px] cursor-pointer ${
                    portion === 'half'
                      ? 'border-amber-900 bg-amber-50 text-stone-900 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Half Serving</span>
                    <span className="font-mono tabular-nums">₹{item.halfPrice}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block mt-0.5">
                    Individual single diner
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Spice Level Adjustment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Heat & Spice Level
              </label>
              <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-700" />
                {spiceLevel === 0 && 'Zero Spice / Mild'}
                {spiceLevel === 1 && 'Classic Mild'}
                {spiceLevel === 2 && 'Medium Spiced'}
                {spiceLevel === 3 && 'Desi Hot (Royal Fiery)'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { level: 0 as SpiceLevel, label: 'Zero' },
                { level: 1 as SpiceLevel, label: 'Mild' },
                { level: 2 as SpiceLevel, label: 'Medium' },
                { level: 3 as SpiceLevel, label: 'Fiery' }
              ].map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpiceLevel(s.level)}
                  className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all text-center min-h-[44px] flex items-center justify-center cursor-pointer ${
                    spiceLevel === s.level
                      ? 'border-amber-900 bg-stone-900 text-amber-300 shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking & Special Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
              Kitchen Preparation Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra green chillies, separate gravy..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-900 font-sans-body"
            />
          </div>

          {/* Quantity Selector with touch targets */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
            <span className="text-xs font-bold text-stone-800">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 min-w-[36px] min-h-[36px] cursor-pointer"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-sm font-black text-stone-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 min-w-[36px] min-h-[36px] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">Total Amount</span>
            <span className="text-lg font-bold font-mono text-stone-900 tabular-nums">
              ₹{itemTotal}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-3 bg-amber-900 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
          >
            Add to Order Bag
          </button>
        </div>
      </div>
    </div>
  );
};
