import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { GeofenceState, TableBookingDetails } from '../types/restaurant';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  geofenceState: GeofenceState;
  onConfirmBooking: (details: TableBookingDetails) => void;
}

const TIME_SLOTS = [
  '12:30 PM',
  '01:15 PM',
  '02:00 PM',
  '07:00 PM',
  '07:45 PM',
  '08:30 PM',
  '09:15 PM',
  '10:00 PM'
];

interface TableLayoutItem {
  id: string;
  label: string;
  zone: 'Main Dining Hall' | 'Royal Heritage Courtyard' | 'Private Maharaja Baithak' | 'Rooftop Terrace';
  seats: number;
  status: 'available' | 'reserved';
}

const RESTAURANT_TABLES: TableLayoutItem[] = [
  { id: 'D1', label: 'D1', zone: 'Main Dining Hall', seats: 2, status: 'available' },
  { id: 'D2', label: 'D2', zone: 'Main Dining Hall', seats: 4, status: 'available' },
  { id: 'D3', label: 'D3', zone: 'Main Dining Hall', seats: 6, status: 'reserved' },
  { id: 'D4', label: 'D4', zone: 'Main Dining Hall', seats: 4, status: 'available' },
  { id: 'D5', label: 'D5', zone: 'Main Dining Hall', seats: 8, status: 'available' },
  { id: 'C1', label: 'C1', zone: 'Royal Heritage Courtyard', seats: 2, status: 'available' },
  { id: 'C2', label: 'C2', zone: 'Royal Heritage Courtyard', seats: 4, status: 'available' },
  { id: 'C3', label: 'C3', zone: 'Royal Heritage Courtyard', seats: 4, status: 'available' },
  { id: 'C4', label: 'C4', zone: 'Royal Heritage Courtyard', seats: 6, status: 'reserved' },
  { id: 'B1', label: 'B1', zone: 'Private Maharaja Baithak', seats: 4, status: 'available' },
  { id: 'B2', label: 'B2', zone: 'Private Maharaja Baithak', seats: 6, status: 'available' },
  { id: 'B3', label: 'B3', zone: 'Private Maharaja Baithak', seats: 10, status: 'available' },
  { id: 'R1', label: 'R1', zone: 'Rooftop Terrace', seats: 2, status: 'available' },
  { id: 'R2', label: 'R2', zone: 'Rooftop Terrace', seats: 4, status: 'available' },
  { id: 'R3', label: 'R3', zone: 'Rooftop Terrace', seats: 4, status: 'available' },
  { id: 'R4', label: 'R4', zone: 'Rooftop Terrace', seats: 6, status: 'available' }
];

export const TableBookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  geofenceState,
  onConfirmBooking
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[3]);
  const [guestsCount, setGuestsCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState<
    'Main Dining Hall' | 'Royal Heritage Courtyard' | 'Private Maharaja Baithak' | 'Rooftop Terrace'
  >('Main Dining Hall');
  const [selectedTableId, setSelectedTableId] = useState<string>('D2');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTableClick = (table: TableLayoutItem) => {
    if (table.status === 'reserved') return;
    setSelectedTableId(table.id);
    setSeatingArea(table.zone);
    if (guestsCount > table.seats) {
      setGuestsCount(table.seats);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please provide the reservation guest name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.length < 10) {
      setError('Please enter a valid 10-digit contact mobile number.');
      return;
    }

    const note = specialRequests
      ? `${specialRequests} (Table ${selectedTableId} selected)`
      : `Table ${selectedTableId} selected`;

    onConfirmBooking({
      date,
      timeSlot,
      guestsCount,
      seatingArea,
      guestName,
      guestPhone,
      specialRequests: note
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm font-sans-body">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-serif-display font-semibold text-amber-300">
                Shankar Royal Table Reservation & Seating
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-400">
              Connaught Place Heritage Dining · Instant Table Assignment
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* Table reservation intro note */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-stone-700 flex items-center justify-between">
            <span className="leading-relaxed">
              Select your favorite table on the floor plan below. Tables are held for 15 minutes past reservation time.
            </span>
            <span className="px-2 py-1 rounded bg-amber-200/80 text-amber-900 font-bold font-mono text-[11px] shrink-0 ml-3">
              Table: {selectedTableId}
            </span>
          </div>

          {/* Interactive 2D Floor Plan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Interactive Floor Plan & Table Selection</span>
              </label>
              <div className="flex items-center gap-3 text-[10px] text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Selected
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-stone-100 border border-stone-300 inline-block" /> Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-stone-300 inline-block" /> Reserved
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-200 space-y-3">
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 text-center border-b border-stone-800 pb-1">
                CENTRAL COURT & ENTRANCE FOYER
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {RESTAURANT_TABLES.map((table) => {
                  const isSelected = selectedTableId === table.id;
                  const isReserved = table.status === 'reserved';

                  return (
                    <button
                      type="button"
                      key={table.id}
                      disabled={isReserved}
                      onClick={() => handleTableClick(table)}
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 text-stone-950 font-bold shadow-md scale-105'
                          : isReserved
                          ? 'bg-stone-800/50 border-stone-800 text-stone-600 cursor-not-allowed opacity-50'
                          : 'bg-stone-800 border-stone-700 text-stone-200 hover:border-amber-400 hover:bg-stone-750'
                      }`}
                    >
                      <span className="font-mono text-xs">{table.label}</span>
                      <span className="text-[9px] opacity-80">{table.seats} seats</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1 border-t border-stone-800/80">
                <span>Selected: Table {selectedTableId} ({seatingArea})</span>
                <span className="text-amber-400">Live Sitar & Ambient Music</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                <span>Reservation Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-500" />
                <span>Guests Count</span>
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'} (Dining Party)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Slot Chips */}
          <div className="space-y-2">
            <label className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Select Seating Time</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                    timeSlot === slot
                      ? 'border-amber-900 bg-amber-900 text-white font-semibold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Dining Ambience Area */}
          <div className="space-y-2">
            <label className="font-semibold text-stone-700 block">
              Seating Atmosphere Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Main Dining Hall', desc: 'Chandelier elegance & live sitar' },
                { name: 'Royal Heritage Courtyard', desc: 'Open-air marble fountain area' },
                { name: 'Private Maharaja Baithak', desc: 'Intimate royal silk seating' },
                { name: 'Rooftop Terrace', desc: 'Overlooking Connaught Place skyline' }
              ].map((area) => (
                <button
                  type="button"
                  key={area.name}
                  onClick={() => {
                    setSeatingArea(area.name as any);
                    const matchingTable = RESTAURANT_TABLES.find(
                      (t) => t.zone === area.name && t.status === 'available'
                    );
                    if (matchingTable) {
                      setSelectedTableId(matchingTable.id);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    seatingArea === area.name
                      ? 'border-amber-900 bg-amber-50/60 text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-semibold block text-stone-900">{area.name}</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">{area.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">Lead Guest Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sharma"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 block">Mobile Phone</label>
              <input
                type="tel"
                required
                placeholder="e.g. 98110 23456"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-700 block">
              Special Occasion or Dining Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Wedding anniversary, high chair needed, quiet booth..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-stone-500">Zero cancellation fee · Instant confirmation</span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Reserve Table {selectedTableId}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
