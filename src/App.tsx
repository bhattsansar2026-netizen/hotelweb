import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  MenuItem,
  CartItem,
  GeofenceState,
  BookingType,
  UserProfile,
  Order,
  SpiceLevel,
  TableBookingDetails,
  MenuSectionType
} from './types/restaurant';
import {
  SHANKAR_RESTAURANT_LOCATION,
  calculateHaversineDistanceKm,
  getLiveDeviceLocation,
  PRESET_LOCATIONS
} from './services/locationService';
import { cloudflareTurnstile } from './services/cloudflareTurnstile';
import { auth, signOutUser } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  fetchUserOrders,
  saveOrderToFirestore,
  INITIAL_REAL_ORDERS
} from './services/orderService';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { HeritageStorySection } from './components/HeritageStorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ItemCustomizationModal } from './components/ItemCustomizationModal';
import { TableBookingModal } from './components/TableBookingModal';
import { AuthModal } from './components/AuthModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersModal } from './components/OrdersModal';
import { CallToOrderModal } from './components/CallToOrderModal';
import { ExploreModal } from './components/ExploreModal';
import { CateringModal } from './components/CateringModal';
import { VisitUsModal } from './components/VisitUsModal';
import { HelpModal, HelpTabType } from './components/HelpModal';
import { FloatingActionButtons } from './components/FloatingActionButtons';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  // App state
  const [bookingType, setBookingType] = useState<BookingType>('delivery');
  const [activeMenuSection, setActiveMenuSection] = useState<MenuSectionType>('all_day');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState<number>(
    SHANKAR_RESTAURANT_LOCATION.maxDeliveryRadiusKm
  );
  const [dineInRadiusMeters] = useState<number>(
    SHANKAR_RESTAURANT_LOCATION.maxDineInRadiusMeters
  );

  // Cart state & animations
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shankar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Real Orders state (empty by default until user signs in and orders)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shankar_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Profile (logged out guest by default)
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('shankar_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'guest',
            name: '',
            phone: '',
            email: '',
            authProvider: 'guest',
            isLoggedIn: false,
            savedAddresses: [],
            loyaltyPoints: 0,
            recentOrdersCount: 0
          };
    } catch {
      return {
        id: 'guest',
        name: '',
        phone: '',
        email: '',
        authProvider: 'guest',
        isLoggedIn: false,
        savedAddresses: [],
        loyaltyPoints: 0,
        recentOrdersCount: 0
      };
    }
  });

  // Geofence state (Default initialized to Connaught Place nearby preset so app is ready)
  const [geofenceState, setGeofenceState] = useState<GeofenceState>(() => {
    const defaultPreset = PRESET_LOCATIONS[1]; // Connaught Place Barakhamba Road (0.6 km away)
    const distance = calculateHaversineDistanceKm(
      SHANKAR_RESTAURANT_LOCATION.center.lat,
      SHANKAR_RESTAURANT_LOCATION.center.lng,
      defaultPreset.lat,
      defaultPreset.lng
    );

    return {
      userCoords: {
        lat: defaultPreset.lat,
        lng: defaultPreset.lng,
        addressLabel: defaultPreset.name,
        accuracyMeters: 10
      },
      distanceKm: distance,
      distanceMeters: Math.round(distance * 1000),
      isInsideDeliveryRadius: distance <= SHANKAR_RESTAURANT_LOCATION.maxDeliveryRadiusKm,
      isInsideDineInRadius: distance * 1000 <= SHANKAR_RESTAURANT_LOCATION.maxDineInRadiusMeters,
      status: 'simulated',
      errorMessage: null,
      lastCheckedAt: new Date().toLocaleTimeString()
    };
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Denver Spice Room Navigation feature modals
  const [isCallToOrderOpen, setIsCallToOrderOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [exploreInitialTab, setExploreInitialTab] = useState<'gallery' | 'buffet_vs_thali'>('gallery');
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [isVisitUsOpen, setIsVisitUsOpen] = useState(false);
  const [visitUsInitialTab, setVisitUsInitialTab] = useState<'location' | 'about_us'>('location');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpInitialTab, setHelpInitialTab] = useState<HelpTabType>('faqs');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shankar_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cartItems]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shankar_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shankar_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [orders]);

  // Firebase Auth State Listener (Google Sign-In integration)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const googleProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Shankar Guest',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '98110 23456',
          photoURL: fbUser.photoURL || undefined,
          authProvider: 'google',
          isLoggedIn: true,
          savedAddresses: [
            'Flat 402, Block B, Barakhamba Road, Connaught Place, New Delhi',
            'C-12, Green Park Main, South Delhi'
          ],
          loyaltyPoints: 500,
          recentOrdersCount: orders.length
        };
        setUser(googleProfile);

        // Fetch user's real orders from Firestore
        const userOrders = await fetchUserOrders(fbUser.uid);
        if (userOrders && userOrders.length > 0) {
          setOrders(userOrders);
        }
      }
    });

    return () => unsubscribe();
  }, [orders.length]);

  // Load real orders on initial load
  useEffect(() => {
    const loadOrders = async () => {
      const fetched = await fetchUserOrders(user.id);
      if (fetched && fetched.length > 0) {
        setOrders(fetched);
      }
    };
    loadOrders();
  }, [user.id]);

  // Start Cloudflare Turnstile background verification silently
  useEffect(() => {
    cloudflareTurnstile.runBackgroundChallenge(false);
  }, []);

  // Update geofence verification helper
  const updateGeofenceCoordinates = useCallback(
    (lat: number, lng: number, addressLabel: string, accuracy = 15, isGPS = false) => {
      const distance = calculateHaversineDistanceKm(
        SHANKAR_RESTAURANT_LOCATION.center.lat,
        SHANKAR_RESTAURANT_LOCATION.center.lng,
        lat,
        lng
      );

      const isInsideDelivery = distance <= deliveryRadiusKm;
      const isInsideDineIn = distance * 1000 <= dineInRadiusMeters;

      setGeofenceState({
        userCoords: {
          lat,
          lng,
          addressLabel,
          accuracyMeters: accuracy
        },
        distanceKm: distance,
        distanceMeters: Math.round(distance * 1000),
        isInsideDeliveryRadius: isInsideDelivery,
        isInsideDineInRadius: isInsideDineIn,
        status: isGPS ? 'granted' : 'simulated',
        errorMessage: null,
        lastCheckedAt: new Date().toLocaleTimeString()
      });
    },
    [deliveryRadiusKm, dineInRadiusMeters]
  );

  // Trigger real browser GPS
  const handleRequestLiveGPS = async () => {
    setGeofenceState((prev) => ({ ...prev, status: 'requesting', errorMessage: null }));
    try {
      const coords = await getLiveDeviceLocation();
      updateGeofenceCoordinates(
        coords.lat,
        coords.lng,
        coords.addressLabel,
        coords.accuracyMeters,
        true
      );
    } catch (err: any) {
      setGeofenceState((prev) => ({
        ...prev,
        status: 'denied',
        errorMessage: err?.message || 'Could not acquire GPS position.'
      }));
    }
  };

  // Switch preset location
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_LOCATIONS.find((p) => p.id === presetId);
    if (!preset) return;
    updateGeofenceCoordinates(preset.lat, preset.lng, preset.name, 10, false);
  };

  // Recalculate geofence when radius changes
  const handleUpdateRadiusKm = (newRadius: number) => {
    setDeliveryRadiusKm(newRadius);
    if (geofenceState.userCoords) {
      const distance = calculateHaversineDistanceKm(
        SHANKAR_RESTAURANT_LOCATION.center.lat,
        SHANKAR_RESTAURANT_LOCATION.center.lng,
        geofenceState.userCoords.lat,
        geofenceState.userCoords.lng
      );
      setGeofenceState((prev) => ({
        ...prev,
        isInsideDeliveryRadius: distance <= newRadius
      }));
    }
  };

  // Cart operations with delightful visual animation feedback
  const handleAddToCart = (
    item: MenuItem,
    portion: 'full' | 'half' = 'full',
    spiceLevel: SpiceLevel = 1,
    quantity: number = 1,
    specialInstructions?: string
  ) => {
    const unitPrice = portion === 'half' && item.halfPrice ? item.halfPrice : item.price;
    const cartItemId = `${item.id}_${portion}_spice${spiceLevel}_${specialInstructions || ''}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                itemTotal: (i.quantity + quantity) * unitPrice
              }
            : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity,
          portion,
          spiceLevel,
          specialInstructions,
          itemTotal: unitPrice * quantity
        }
      ];
    });

    // 1. Trigger shopping bag icon animation bounce
    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 650);

    // 2. Trigger floating notification pill
    setToastMessage(`Added ${quantity > 1 ? `${quantity}x ` : ''}${item.name} to Bag`);
    setTimeout(() => setToastMessage(null), 2400);

    // Trigger Cloudflare silent background entropy check on cart interaction
    cloudflareTurnstile.runBackgroundChallenge(false);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId === cartItemId) {
          const unitPrice =
            i.portion === 'half' && i.menuItem.halfPrice ? i.menuItem.halfPrice : i.menuItem.price;
          return {
            ...i,
            quantity: newQuantity,
            itemTotal: newQuantity * unitPrice
          };
        }
        return i;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Reorder dishes from order history
  const handleReorder = (items: CartItem[]) => {
    setCartItems((prev) => {
      const combined = [...prev];
      items.forEach((item) => {
        const existing = combined.find((c) => c.cartItemId === item.cartItemId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.itemTotal = existing.quantity * (item.itemTotal / item.quantity);
        } else {
          combined.push({ ...item });
        }
      });
      return combined;
    });

    setIsCartBouncing(true);
    setTimeout(() => setIsCartBouncing(false), 600);
    setIsCartOpen(true);
  };

  // Promo discount apply
  const handleApplyDiscount = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

    if (clean === 'SHANKAR20') {
      const discount = Math.round(subtotal * 0.2);
      setDiscountCode('SHANKAR20 (20% Off)');
      setAppliedDiscount(discount);
      return true;
    }
    if (clean === 'TASTE50') {
      setDiscountCode('TASTE50 (₹50 Off)');
      setAppliedDiscount(Math.min(50, subtotal));
      return true;
    }
    return false;
  };

  // Table reservation complete
  const handleConfirmReservation = (details: TableBookingDetails) => {
    setIsReservationsOpen(false);

    const orderId = `TBL-${Math.floor(1000 + Math.random() * 9000)}`;
    const tableOrder: Order = {
      id: orderId,
      orderNumber: orderId,
      createdAt: `${details.date} at ${details.timeSlot}`,
      bookingType: 'dine_in',
      items: [],
      subtotal: 0,
      gstAmount: 0,
      deliveryFee: 0,
      discountAmount: 0,
      grandTotal: 0,
      customer: {
        name: details.guestName,
        phone: details.guestPhone
      },
      tableDetails: details,
      paymentMethod: 'pay_at_counter',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      geofenceVerification: {
        verified: true,
        distanceKm: geofenceState.distanceKm ?? 0.05,
        userLocationLabel: `${details.seatingArea} Table for ${details.guestsCount} Guests`
      },
      turnstileToken: '0.cf_tnst_tbl_reservation_verified',
      estimatedTimeMinutes: 0
    };

    setActiveOrder(tableOrder);
  };

  // Order success handler with celebratory confetti & real Firestore persistence
  const handleOrderSuccess = async (order: Order) => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCartItems([]);
    setDiscountCode('');
    setAppliedDiscount(0);
    setActiveOrder(order);

    // 1. Add to local orders list immediately
    setOrders((prev) => [order, ...prev]);

    // 2. Persist order into Firestore database
    try {
      await saveOrderToFirestore(order, user.id);
    } catch (e) {
      console.warn('Saved order locally:', e);
    }

    // 3. Fire celebratory confetti animation!
    try {
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Live order status simulator for testing & guest tracking
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id !== orderId) return order;
        let nextStatus: Order['orderStatus'] = order.orderStatus;
        if (order.orderStatus === 'placed') nextStatus = 'confirmed';
        else if (order.orderStatus === 'confirmed') nextStatus = 'cooking';
        else if (order.orderStatus === 'cooking') nextStatus = 'out_for_delivery';
        else if (order.orderStatus === 'out_for_delivery') nextStatus = 'completed';
        return { ...order, orderStatus: nextStatus };
      });
      try {
        localStorage.setItem('shankar_orders', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.itemTotal, 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans-body relative">
      {/* Top Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        isCartBouncing={isCartBouncing}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCallToOrder={() => setIsCallToOrderOpen(true)}
        onOpenExplore={(tab) => {
          setExploreInitialTab(tab);
          setIsExploreOpen(true);
        }}
        onOpenCatering={() => setIsCateringOpen(true)}
        onOpenVisitUs={(tab) => {
          setVisitUsInitialTab(tab);
          setIsVisitUsOpen(true);
        }}
        onOpenHelp={(tab) => {
          setHelpInitialTab(tab);
          setIsHelpOpen(true);
        }}
        onSelectMenuSection={(sec) => setActiveMenuSection(sec)}
        user={user}
      />

      <main className="flex-1 pb-28 sm:pb-24">
        {/* Campaign Hero Section */}
        <HeroSection
          bookingType={bookingType}
          onChangeBookingType={setBookingType}
          onOpenReservations={() => setIsReservationsOpen(true)}
          onScrollToMenu={() => scrollToSection('menu')}
        />

        {/* 3 Sub-Menus: All Day, Lunch Specials & Thalis, Bar & Spirits */}
        <MenuSection
          activeMenuSection={activeMenuSection}
          onChangeMenuSection={setActiveMenuSection}
          onAddToCart={(item, portion, spice) => handleAddToCart(item, portion, spice, 1)}
          onOpenItemModal={(item) => setCustomizingItem(item)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        {/* Heritage Story & Anti-Abuse Credo */}
        <HeritageStorySection
          onOpenReservations={() => setIsReservationsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectMenuSection={(sec) => setActiveMenuSection(sec)}
        onOpenExplore={(tab) => {
          setExploreInitialTab(tab);
          setIsExploreOpen(true);
        }}
        onOpenCatering={() => setIsCateringOpen(true)}
        onOpenVisitUs={(tab) => {
          setVisitUsInitialTab(tab);
          setIsVisitUsOpen(true);
        }}
        onOpenHelp={(tab) => {
          setHelpInitialTab(tab);
          setIsHelpOpen(true);
        }}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenCallToOrder={() => setIsCallToOrderOpen(true)}
      />

      {/* Popping ups of two: Order Now & Call to Order */}
      <FloatingActionButtons
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        isCartBouncing={isCartBouncing}
        onOpenCallToOrder={() => setIsCallToOrderOpen(true)}
        onOpenOrderNow={() => {
          if (cartCount > 0) {
            setIsCartOpen(true);
          } else {
            scrollToSection('menu');
            setIsCartOpen(true);
          }
        }}
      />

      {/* Floating Animated Toast Pill when item is added */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-950/95 text-white px-4 py-2.5 rounded-full shadow-2xl border border-amber-500/30 flex items-center gap-3 text-xs font-medium animate-float-fade backdrop-blur-md">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-stone-100">{toastMessage}</span>
          <button
            onClick={() => {
              setToastMessage(null);
              setIsCartOpen(true);
            }}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 pl-2 border-l border-stone-800 cursor-pointer"
          >
            <span>View Bag</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Denver Spice Room Modals */}
      <CallToOrderModal
        isOpen={isCallToOrderOpen}
        onClose={() => setIsCallToOrderOpen(false)}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenOnlineOrder={() => {
          scrollToSection('menu');
          setIsCartOpen(true);
        }}
      />

      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        initialTab={exploreInitialTab}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenMenu={() => {
          scrollToSection('menu');
        }}
      />

      <CateringModal
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
        onOpenCallToOrder={() => setIsCallToOrderOpen(true)}
      />

      <VisitUsModal
        isOpen={isVisitUsOpen}
        onClose={() => setIsVisitUsOpen(false)}
        initialTab={visitUsInitialTab}
        geofenceState={geofenceState}
        onOpenReservations={() => setIsReservationsOpen(true)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        initialTab={helpInitialTab}
        onOpenCallToOrder={() => setIsCallToOrderOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        bookingType={bookingType}
        geofenceState={geofenceState}
        deliveryRadiusKm={deliveryRadiusKm}
        discountCode={discountCode}
        appliedDiscount={appliedDiscount}
        onApplyDiscount={handleApplyDiscount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenReservations={() => {
          setIsCartOpen(false);
          setIsReservationsOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        bookingType={bookingType}
        geofenceState={geofenceState}
        deliveryRadiusKm={deliveryRadiusKm}
        discountCode={discountCode}
        appliedDiscount={appliedDiscount}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      <ItemCustomizationModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <TableBookingModal
        isOpen={isReservationsOpen}
        onClose={() => setIsReservationsOpen(false)}
        geofenceState={geofenceState}
        onConfirmBooking={handleConfirmReservation}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(updated) => setUser(updated)}
        onLogout={async () => {
          await signOutUser();
          setUser({
            id: 'guest',
            name: '',
            phone: '',
            email: '',
            authProvider: 'guest',
            isLoggedIn: false,
            savedAddresses: [],
            loyaltyPoints: 0,
            recentOrdersCount: 0
          });
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Real Orders & Live Status Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onReorder={handleReorder}
        onViewOrderReceipt={(order) => {
          setIsOrdersOpen(false);
          setActiveOrder(order);
        }}
        onAdvanceOrderStatus={handleAdvanceOrderStatus}
      />

      <OrderSuccessModal
        order={activeOrder}
        isOpen={!!activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      {/* Mobile Bottom Navigation with Ergonomic Thumb Reach */}
      <MobileBottomNav
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        isCartBouncing={isCartBouncing}
        ordersCount={orders.length}
        user={user}
        geofenceState={geofenceState}
        activeMenuSection={activeMenuSection}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenReservations={() => setIsReservationsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenGeofenceRadar={() => setIsGeofenceRadarOpen(true)}
        onScrollToMenu={() => scrollToSection('menu')}
      />
    </div>
  );
}
