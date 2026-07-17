import React, { useState, useEffect } from "react";
import { Calendar, Trash2, CheckCircle, Clock, AlertTriangle, Bike as BikeIcon, ShieldEllipsis, ShieldCheck } from "lucide-react";
import { Booking, User } from "../types";

interface BookingsProps {
  user: User | null;
  onOpenAuth: () => void;
}

export default function Bookings({ user, onOpenAuth }: BookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bookings");
      }
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }
      // Update local state
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || "Error cancelling booking");
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6" id="bookings-auth-gate">
        <div className="w-16 h-16 bg-[#0a0a0c] border-2 border-zinc-900 text-ktm-orange rounded-none flex items-center justify-center mx-auto shadow-lg shadow-orange-600/5 transform -skew-x-12">
          <Calendar className="w-7 h-7 transform skew-x-12" />
        </div>
        <div className="space-y-3 max-w-sm mx-auto">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter italic">RIDER BOOKINGS ACCESS</h2>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Please log in to your KTM account to access purchase records, complimentary test ride history, and active showroom slots.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="px-8 py-3.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none text-xs font-display font-black italic uppercase tracking-widest transition-all cursor-pointer transform -skew-x-12 shadow-lg shadow-orange-600/10"
          id="bookings-btn-gate-login"
        >
          <div className="transform skew-x-12">Sign In / Register</div>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="bookings-module-container">
      
      {/* Header */}
      <div className="text-left space-y-3 relative mb-12">
        <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-[0.03] overflow-hidden hidden sm:block">
          <span className="text-stroke-white text-[9rem] uppercase font-display font-black italic tracking-tighter block whitespace-nowrap">
            RESERVES
          </span>
        </div>
        <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">YOUR KTM RESERVATIONS</span>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic relative z-10">MY ACTIVE RIDES</h1>
        <p className="text-zinc-400 text-sm max-w-xl font-sans relative z-10">
          Review, configure or track your active purchase reserves and dealership test rides. Reach out to dealers to adjust dates.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono text-xs" id="bookings-loading">
          SYNCHRONIZING WITH SHOWROOM DATABASE...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-950/20 border-2 border-red-900/50 text-red-400 text-xs rounded-none font-mono" id="bookings-error">
          {error}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bookings-grid-list">
          {bookings.map((booking) => {
            const isTestRide = booking.type === "Test Ride";
            
            // Status Badges Colors
            let statusColor = "bg-zinc-900 text-zinc-400 border-zinc-800";
            let StatusIcon = Clock;
            if (booking.status === "Confirmed") {
              statusColor = "bg-emerald-950/40 text-emerald-400 border-emerald-900/50";
              StatusIcon = ShieldCheck;
            } else if (booking.status === "Cancelled") {
              statusColor = "bg-red-950/40 text-red-400 border-red-900/50";
              StatusIcon = AlertTriangle;
            } else if (booking.status === "Completed") {
              statusColor = "bg-blue-950/40 text-blue-400 border-blue-900/50";
              StatusIcon = CheckCircle;
            }

            return (
              <div
                key={booking.id}
                className="bg-[#0a0a0c] border-2 border-zinc-900 p-6 rounded-none text-left flex flex-col justify-between hover:border-zinc-800 transition-all duration-200"
                id={`booking-card-${booking.id}`}
              >
                <div className="space-y-4">
                  {/* Category Type Badge & Status Indicator */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3.5 py-1 text-[10px] font-display font-black uppercase tracking-wider transform -skew-x-12 ${
                      isTestRide ? "bg-ktm-orange text-white" : "bg-white text-zinc-950"
                    }`}>
                      <div className="transform skew-x-12">{booking.type}</div>
                    </span>
                    <span className={`px-3 py-1 rounded-none text-[10px] font-display font-black border flex items-center gap-1.5 uppercase tracking-wider transform -skew-x-12 ${statusColor}`}>
                      <div className="transform skew-x-12 flex items-center gap-1">
                        <StatusIcon className="w-3.5 h-3.5" />
                        {booking.status}
                      </div>
                    </span>
                  </div>

                  {/* Bike Info */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-none text-ktm-orange border border-zinc-800 transform -skew-x-12">
                      <BikeIcon className="w-5 h-5 transform skew-x-12" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-xl text-white uppercase italic leading-tight tracking-tight">{booking.bikeName}</h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">BOOKING ID: {booking.id}</p>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-y-2 border-zinc-900 text-xs font-mono">
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Preferred Date</span>
                      <span className="text-zinc-200 font-bold">{booking.date}</span>
                    </div>
                    {isTestRide && (
                      <div>
                        <span className="block text-[10px] text-zinc-500 uppercase tracking-wider">Time Slot</span>
                        <span className="text-zinc-200 font-bold">{booking.timeSlot}</span>
                      </div>
                    )}
                  </div>

                  {/* User message if exists */}
                  {booking.message && (
                    <div className="p-3.5 bg-zinc-900/40 border border-zinc-900 rounded-none text-xs text-zinc-400 font-sans leading-relaxed">
                      <span className="block text-[9px] font-display font-black text-zinc-500 uppercase tracking-widest mb-1.5">Rider Notes</span>
                      "{booking.message}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                  <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex items-center gap-1.5 text-xs font-display font-black text-red-400 hover:text-white uppercase tracking-widest hover:underline cursor-pointer transition-colors"
                      id={`btn-cancel-${booking.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel Reserve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#0a0a0c] border-2 border-zinc-900 rounded-none space-y-4" id="bookings-empty">
          <Calendar className="w-12 h-12 text-zinc-700 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-xl font-display font-black text-zinc-350 uppercase italic">NO ACTIVE BOOKINGS</h3>
            <p className="text-xs text-zinc-500 font-sans">You do not have any active purchases or test rides scheduled currently.</p>
          </div>
        </div>
      )}

    </div>
  );
}
