export type SpiceLevel = 0 | 1 | 2 | 3;

export type BookingType = 'delivery' | 'dine_in' | 'takeaway' | 'catering';

export type MenuSectionType = 'all_day' | 'lunch' | 'bar';

export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  addressLabel: string;
  accuracyMeters?: number;
}

export interface GeofenceConfig {
  restaurantName: string;
  restaurantAddress: string;
  center: LocationCoordinates;
  maxDeliveryRadiusKm: number;
  maxDineInRadiusMeters: number;
}

export interface GeofenceState {
  userCoords: LocationCoordinates | null;
  distanceKm: number | null;
  distanceMeters: number | null;
  isInsideDeliveryRadius: boolean;
  isInsideDineInRadius: boolean;
  status: 'prompt' | 'requesting' | 'granted' | 'denied' | 'simulated';
  errorMessage: string | null;
  lastCheckedAt: string | null;
}

export interface CloudflareTurnstileState {
  status: 'unverified' | 'verifying' | 'verified' | 'failed' | 'expired' | 'challenge_required';
  token: string | null;
  cfRayId: string | null;
  botScore: number;
  verifiedAt: string | null;
  challengeType: 'invisible' | 'managed' | 'interactive';
}

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  menuSection: MenuSectionType;
  category: string;
  description: string;
  price: number;
  halfPrice?: number;
  dietary: DietaryType;
  spiceLevel: SpiceLevel;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  image: string;
  prepTimeMinutes?: number;
  calories?: number;
  allergens?: string[];
  volumeOrServing?: string;
  alcoholPercentage?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  portion: 'full' | 'half';
  spiceLevel: SpiceLevel;
  specialInstructions?: string;
  itemTotal: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  authProvider?: 'guest' | 'google' | 'phone';
  isLoggedIn: boolean;
  savedAddresses: string[];
  loyaltyPoints: number;
  recentOrdersCount: number;
  photoURL?: string;
}

export interface TableBookingDetails {
  date: string;
  timeSlot: string;
  guestsCount: number;
  seatingArea: 'Main Dining Hall' | 'Royal Heritage Courtyard' | 'Private Maharaja Baithak' | 'Rooftop Terrace';
  guestName: string;
  guestPhone: string;
  specialRequests?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  bookingType: BookingType;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  deliveryFee: number;
  discountAmount: number;
  discountCode?: string;
  grandTotal: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tableNumber?: string;
  };
  tableDetails?: TableBookingDetails;
  paymentMethod: 'online_upi_card' | 'pay_at_counter' | 'cash_on_delivery' | 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  orderStatus: 'placed' | 'confirmed' | 'cooking' | 'out_for_delivery' | 'completed' | 'cancelled' | 'ready_at_table';
  geofenceVerification: {
    verified: boolean;
    distanceKm: number;
    userLocationLabel: string;
  };
  turnstileToken: string;
  estimatedTimeMinutes: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ambiance' | 'dishes' | 'tandoor' | 'bar';
  image: string;
  caption: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experienceRequired: string;
  description: string;
  requirements: string[];
}

export interface AllergenRow {
  dishName: string;
  menuSection: string;
  dietary: string;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  vegan: boolean;
  jainFriendly: boolean;
  notes: string;
}
