import React from 'react';
import {
  X,
  Clock,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  ChefHat,
  Truck,
  ArrowRight,
  Sparkles,
  MapPin,
  Play
} from 'lucide-react';
import { Order, CartItem } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onReorder: (items: CartItem[]) => void;
  onViewOrderReceipt: (order: Order) => void;
  onAdvanceOrderStatus?: (orderId: string) => void;
}

export const OrdersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  orders,
  onReorder,
  onViewOrderReceipt,
  onAdvanceOrderStatus
}) => {
  if (!isOpen) return null;

  const getStatusProgress = (status: Order['orderStatus']) => {
    switch (status) {
      case 'placed':
        return 20;
      case 'confirmed':
        return 40;
      case 'cooking':
        return 65;
      case 'out_for_delivery':
      case 'ready_at_table':
        return 85;
      case 'completed':
        return 100;
      default:
        return 15;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-sans-body">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif-display font-semibold text-amber-300">
                Your Shankar Orders & Live Dining Tracker
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Synchronized with Shankar Restaurant Connaught Place
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-800">No Orders Yet</p>
              <p className="text-xs text-stone-500">
                Place your first royal Mughlai or Tandoori order to track it live here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isCompleted = order.orderStatus === 'completed';
              const isCooking = order.orderStatus === 'cooking' || order.orderStatus === 'confirmed';
              const progressPercent = getStatusProgress(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3.5 hover:border-amber-700/40 transition-colors"
                >
                  {/* Order header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-xs text-stone-500">{order.createdAt}</span>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Delivered & Served</span>
                        </span>
                      ) : isCooking ? (
                        <span className="flex items-center gap-1 text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full text-[11px] animate-pulse">
                          <ChefHat className="w-3 h-3 text-amber-700" />
                          <span>Cooking in Tandoor</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-stone-700 bg-stone-200 px-2.5 py-0.5 rounded-full text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span className="capitalize">{order.orderStatus.replace('_', ' ')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Live Progress Bar */}
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-medium">
                      <span className="flex items-center gap-1 text-amber-900 font-semibold">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Live Preparation & Dispatch Status</span>
                      </span>
                      <span>{progressPercent}% Complete</span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs space-y-1 py-1 border-y border-stone-200/60">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-stone-700">
                        <span>
                          <span className="font-semibold font-mono text-stone-900 mr-1.5">
                            {item.quantity}x
                          </span>
                          {item.menuItem.name}
                          <span className="text-[11px] text-stone-400 ml-1 capitalize">
                            ({item.portion})
                          </span>
                        </span>
                        <span className="font-mono tabular-nums font-medium text-stone-900">
                          ₹{item.itemTotal}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom actions & total */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-stone-500 block">Total</span>
                      <span className="font-mono text-sm font-bold text-stone-950 tabular-nums">
                        ₹{order.grandTotal}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onAdvanceOrderStatus && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-amber-300"
                          title="Simulate advancing to next order status stage"
                        >
                          <Play className="w-2.5 h-2.5 fill-amber-900" />
                          <span>Advance Status</span>
                        </button>
                      )}

                      <button
                        onClick={() => onViewOrderReceipt(order)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-white border border-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Receipt
                      </button>

                      {order.items.length > 0 && (
                        <button
                          onClick={() => {
                            onReorder(order.items);
                            onClose();
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <RotateCcw className="w-3 h-3 text-stone-950" />
                          <span>Reorder All</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Connaught Place Express · Real-time Sync</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
