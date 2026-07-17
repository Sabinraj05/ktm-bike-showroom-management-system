import React, { useState, useEffect, FormEvent } from "react";
import { Search, SlidersHorizontal, ArrowLeft, Fuel, Zap, Weight, ShieldAlert, CalendarClock, ShoppingBag, CheckCircle, Info } from "lucide-react";
import { Bike, User } from "../types";

interface BikesProps {
  user: User | null;
  bikes: Bike[];
  selectedBike: Bike | null;
  onSelectBike: (bike: Bike | null) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onOpenAuth: () => void;
}

export default function Bikes({
  user,
  bikes,
  selectedBike,
  onSelectBike,
  categoryFilter,
  setCategoryFilter,
  onOpenAuth
}: BikesProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"none" | "low-high" | "high-low">("none");
  
  // Booking Form States
  const [bookingType, setBookingType] = useState<"Purchase" | "Test Ride" | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("10:00 AM - 11:30 AM");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const categories = ["All", "Naked", "Supersport", "Adventure", "Motocross"];

  // Filter and sort bikes
  const filteredBikes = bikes
    .filter((bike) => {
      const matchesCategory = categoryFilter === "" || categoryFilter === "All" || bike.category === categoryFilter;
      const matchesSearch = bike.name.toLowerCase().includes(search.toLowerCase()) || 
                            bike.description.toLowerCase().includes(search.toLowerCase()) ||
                            bike.engineSize.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "low-high") return a.price - b.price;
      if (sortBy === "high-low") return b.price - a.price;
      return 0;
    });

  const handleBookingSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!selectedBike || !bookingType) return;

    setBookingError("");
    setBookingLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          bikeId: selectedBike.id,
          bikeName: selectedBike.name,
          type: bookingType,
          date: bookingDate,
          timeSlot: bookingType === "Test Ride" ? bookingTimeSlot : undefined,
          message: bookingMessage
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      setBookingSuccess(true);
      // Clear booking form inputs
      setBookingDate("");
      setBookingMessage("");
    } catch (err: any) {
      setBookingError(err.message || "Something went wrong.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleOpenBooking = (type: "Purchase" | "Test Ride") => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setBookingType(type);
    setBookingSuccess(false);
    setBookingError("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="bikes-module-container">
      
      {/* 1. BIKE DETAILS PANE (If active) */}
      {selectedBike ? (
        <div className="space-y-8 animate-fade-in text-left" id="bike-detail-view">
          
          {/* Back Button */}
          <button
            onClick={() => { onSelectBike(null); setBookingType(null); }}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors py-2 group cursor-pointer"
            id="detail-btn-back"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-ktm-orange" />
            <span className="text-xs font-display font-black italic uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Back to Showroom</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Image */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative bg-zinc-950 border-2 border-zinc-900 rounded-sm overflow-hidden h-[300px] sm:h-[450px]">
                <img
                  src={selectedBike.image}
                  alt={selectedBike.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-6 left-6 px-4 py-1.5 bg-ktm-orange text-white text-xs font-display font-black tracking-widest uppercase transform -skew-x-12">
                  <div className="transform skew-x-12">{selectedBike.category}</div>
                </span>
                <span className="absolute bottom-6 right-6 bg-black text-ktm-orange font-mono font-black text-xl px-4 py-2 border border-ktm-orange/30 transform -skew-x-12">
                  <div className="transform skew-x-12">${selectedBike.price.toLocaleString()}</div>
                </span>
              </div>
            </div>

            {/* Right: Spec Info & Booking Callout */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-display font-black text-ktm-orange uppercase tracking-[0.25em]">READY TO RACE SERIES</span>
                <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic">{selectedBike.name}</h1>
                <p className="text-zinc-400 text-sm leading-relaxed font-sans">{selectedBike.description}</p>
                
                {/* Tech Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="bg-[#0b0b0d] border-2 border-zinc-900 p-4 rounded-sm flex flex-col items-center justify-center text-center">
                    <Zap className="w-5 h-5 text-ktm-orange mb-1.5" />
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Power</span>
                    <span className="text-xs font-display font-black text-white uppercase italic">{selectedBike.power}</span>
                  </div>
                  <div className="bg-[#0b0b0d] border-2 border-zinc-900 p-4 rounded-sm flex flex-col items-center justify-center text-center">
                    <Fuel className="w-5 h-5 text-ktm-orange mb-1.5" />
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Engine</span>
                    <span className="text-xs font-display font-black text-white uppercase italic">{selectedBike.engineSize}</span>
                  </div>
                  <div className="bg-[#0b0b0d] border-2 border-zinc-900 p-4 rounded-sm flex flex-col items-center justify-center text-center">
                    <Weight className="w-5 h-5 text-ktm-orange mb-1.5" />
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Dry Weight</span>
                    <span className="text-xs font-display font-black text-white uppercase italic">{selectedBike.specs.weight}</span>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="p-6 bg-[#0a0a0c] border-2 border-zinc-900 rounded-sm mt-6 space-y-4">
                <h3 className="text-xs font-display font-black text-white uppercase tracking-widest italic">Showroom Booking Center</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleOpenBooking("Test Ride")}
                    className="py-3.5 px-4 bg-transparent hover:bg-white border-2 border-ktm-orange hover:border-white text-ktm-orange hover:text-black rounded-sm font-display font-black italic uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer transform -skew-x-12"
                    id="detail-btn-test-ride"
                  >
                    <div className="transform skew-x-12 flex items-center justify-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      Book Test Ride
                    </div>
                  </button>
                  <button
                    onClick={() => handleOpenBooking("Purchase")}
                    className="py-3.5 px-4 bg-ktm-orange hover:bg-white text-white hover:text-black border-2 border-transparent hover:border-white rounded-sm font-display font-black italic uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/10 cursor-pointer transform -skew-x-12"
                    id="detail-btn-purchase"
                  >
                    <div className="transform skew-x-12 flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Reserve Purchase
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Technical Specifications Panel */}
          <div className="pt-10 border-t-2 border-zinc-900">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter italic mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0b0b0d] border-2 border-zinc-900 rounded-sm p-6">
                <h3 className="text-xs font-display font-black text-ktm-orange uppercase tracking-widest italic mb-4">Engine & Drivetrain</h3>
                <table className="w-full text-xs text-zinc-400 font-mono">
                  <tbody>
                    <tr className="border-b border-zinc-900">
                      <td className="py-3 font-semibold text-zinc-500">Displacement</td>
                      <td className="py-3 text-right text-white font-medium">{selectedBike.specs.displacement}</td>
                    </tr>
                    <tr className="border-b border-zinc-900">
                      <td className="py-3 font-semibold text-zinc-500">Transmission</td>
                      <td className="py-3 text-right text-white font-medium">{selectedBike.specs.transmission}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-zinc-500">Cooling System</td>
                      <td className="py-3 text-right text-white font-medium">{selectedBike.specs.cooling}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-[#0b0b0d] border-2 border-zinc-900 rounded-sm p-6">
                <h3 className="text-xs font-display font-black text-ktm-orange uppercase tracking-widest italic mb-4">Chassis & Capacities</h3>
                <table className="w-full text-xs text-zinc-400 font-mono">
                  <tbody>
                    <tr className="border-b border-zinc-900">
                      <td className="py-3 font-semibold text-zinc-500">Fuel Tank Capacity</td>
                      <td className="py-3 text-right text-white font-medium">{selectedBike.specs.fuelCapacity}</td>
                    </tr>
                    <tr className="border-b border-zinc-900">
                      <td className="py-3 font-semibold text-zinc-500">Dry Weight</td>
                      <td className="py-3 text-right text-white font-medium">{selectedBike.specs.weight}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-zinc-500">Braking Tech</td>
                      <td className="py-3 text-right text-white font-medium">Brembo/BYBRE Discs (Dual-Channel ABS)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interactive Booking Module Slide-in/Overlay */}
          {bookingType && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" id="booking-form-overlay">
              <div className="relative w-full max-w-lg bg-[#0a0a0c] border-2 border-zinc-800 rounded-sm overflow-hidden ktm-box-glow text-left">
                <div className="bg-ktm-orange h-3 w-full" />
                <div className="racing-stripe-orange-black h-2 w-full"></div>
                
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3.5 py-1 bg-ktm-orange text-white text-[10px] font-display font-black uppercase tracking-widest mb-2 transform -skew-x-12">
                        <div className="transform skew-x-12">{bookingType} MODALITY</div>
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tighter italic">
                        {bookingType === "Test Ride" ? "SCHEDULE TEST RIDE" : "RESERVE BIKE PURCHASE"}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1 font-sans">
                        For <span className="text-white font-bold">{selectedBike.name}</span> (${selectedBike.price.toLocaleString()})
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingType(null)}
                      className="p-1.5 bg-zinc-900 hover:bg-ktm-orange hover:text-black border border-zinc-800 rounded-none text-zinc-400 transition-colors font-display font-black text-sm"
                      id="booking-btn-close"
                    >
                      X
                    </button>
                  </div>

                  {bookingSuccess ? (
                    <div className="p-6 bg-[#0c0c0e] border border-zinc-850 rounded-none text-center space-y-4" id="booking-success-view">
                      <div className="w-12 h-12 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 rounded-sm flex items-center justify-center mx-auto transform -skew-x-12">
                        <CheckCircle className="w-6 h-6 transform skew-x-12" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-display font-black text-white uppercase italic">Reservation Successful!</h3>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                          {bookingType === "Test Ride" 
                            ? "Your KTM test ride slot has been logged! Our representatives will contact you shortly to confirm." 
                            : "Your purchase reservation of the KTM has been registered! Standard dealer procedures have commenced."
                          }
                        </p>
                      </div>
                      <div className="pt-4 flex justify-center">
                        <button
                          onClick={() => { setBookingType(null); setBookingSuccess(false); }}
                          className="px-6 py-2.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none text-xs font-display font-black italic uppercase tracking-widest transition-colors transform -skew-x-12 cursor-pointer"
                          id="booking-success-close"
                        >
                          <div className="transform skew-x-12">SHOWROOM BACK</div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      {bookingError && (
                        <div className="p-3 bg-red-950/40 border-2 border-red-900/50 text-red-400 text-xs rounded-sm font-mono">
                          {bookingError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Rider Full Name</label>
                          <input
                            type="text"
                            disabled
                            value={user?.name || ""}
                            className="w-full p-2.5 bg-zinc-900/40 border border-zinc-800 rounded-none text-xs text-zinc-400 cursor-not-allowed font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Registered Email</label>
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full p-2.5 bg-zinc-900/40 border border-zinc-800 rounded-none text-xs text-zinc-400 cursor-not-allowed font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Preferred Date</label>
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-mono"
                            id="booking-input-date"
                          />
                        </div>

                        {bookingType === "Test Ride" && (
                          <div>
                            <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Available Slot</label>
                            <select
                              value={bookingTimeSlot}
                              onChange={(e) => setBookingTimeSlot(e.target.value)}
                              className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-mono cursor-pointer"
                              id="booking-input-slot"
                            >
                              <option>10:00 AM - 11:30 AM</option>
                              <option>12:00 PM - 01:30 PM</option>
                              <option>02:00 PM - 03:30 PM</option>
                              <option>04:00 PM - 05:30 PM</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Rider Notes / Message (Optional)</label>
                        <textarea
                          rows={3}
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                          placeholder="State any specific preferences, riding history or custom requests..."
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-ktm-orange font-sans"
                          id="booking-input-message"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full py-3.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none font-display font-black italic uppercase text-sm tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transform -skew-x-12 shadow-lg shadow-orange-600/10"
                        id="booking-btn-submit"
                      >
                        <div className="transform skew-x-12">
                          {bookingLoading ? "SUBMITTING RESERVATION..." : bookingType === "Test Ride" ? "CONFIRM TEST RIDE" : "PLACE PURCHASE RESERVATION"}
                        </div>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* 2. SHOWROOM LIST VIEW (If no bike selected) */
        <div className="space-y-8" id="showroom-list-view">
          
          {/* Header */}
          <div className="text-left space-y-3 relative mb-12">
            <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-[0.03] overflow-hidden hidden sm:block">
              <span className="text-stroke-white text-[9rem] uppercase font-display font-black italic tracking-tighter block whitespace-nowrap">
                MATTIGHOFEN
              </span>
            </div>
            <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">ESTABLISHED MATTIGHOFEN SHOWROOM</span>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic relative z-10">THE KTM GARAGE</h1>
            <p className="text-zinc-400 text-sm max-w-xl font-sans relative z-10">
              Explore the pinnacle of Austrian mechanical design. Use our filters and search engine to discover your absolute match.
            </p>
          </div>

          {/* Search, Sort and Category Filters */}
          <div className="p-6 bg-[#0a0a0c] border-2 border-zinc-900 rounded-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6" id="showroom-search-filters">
            {/* Search and Category buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by name, category or motor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="bike-search-input"
                />
              </div>

              {/* Sort selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-4 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange cursor-pointer appearance-none font-mono"
                  id="bike-sort-select"
                >
                  <option value="none">Sort by Price</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <SlidersHorizontal className="absolute right-4 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2" id="bike-category-filters">
              {categories.map((cat) => {
                const isActive = (categoryFilter === "" && cat === "All") || categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat === "All" ? "" : cat)}
                    className={`px-5 py-2.5 text-xs font-display font-black italic tracking-widest uppercase cursor-pointer transform -skew-x-12 transition-all duration-200 rounded-none ${
                      isActive
                        ? "bg-ktm-orange text-white border-2 border-ktm-orange shadow-md shadow-orange-600/10"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border-2 border-zinc-800 hover:border-zinc-700"
                    }`}
                    id={`filter-btn-${cat.toLowerCase()}`}
                  >
                    <div className="transform skew-x-12">{cat}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bike Grid */}
          {filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="bikes-grid-layout">
              {filteredBikes.map((bike) => (
                <div
                  key={bike.id}
                  className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none overflow-hidden hover:border-ktm-orange/50 hover:shadow-2xl hover:shadow-orange-600/5 transition-all duration-300 flex flex-col text-left group"
                  id={`bike-card-${bike.id}`}
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 px-3.5 py-1 bg-ktm-orange text-white text-[10px] font-display font-black uppercase tracking-wider transform -skew-x-12">
                      <div className="transform skew-x-12">{bike.category}</div>
                    </span>
                    <span className="absolute bottom-4 right-4 bg-black/90 text-white font-mono font-bold text-sm px-3.5 py-1.5 border border-zinc-800 transform -skew-x-12">
                      <div className="transform skew-x-12">${bike.price.toLocaleString()}</div>
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-display font-black italic uppercase text-white group-hover:text-ktm-orange tracking-tight transition-colors">
                        {bike.name}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                        {bike.description}
                      </p>
                      
                      {/* Tech specs */}
                      <div className="grid grid-cols-2 gap-2 pt-3 text-[11px] text-zinc-500 font-mono border-t border-zinc-900/60">
                        <div>Engine: <span className="text-zinc-200 font-semibold">{bike.engineSize}</span></div>
                        <div>Power: <span className="text-zinc-200 font-semibold">{bike.power}</span></div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => onSelectBike(bike)}
                        className="w-full py-3 bg-zinc-900 hover:bg-ktm-orange border border-zinc-850 hover:border-ktm-orange text-white hover:text-black rounded-none font-display font-black italic text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 transform -skew-x-12"
                      >
                        <div className="transform skew-x-12 flex items-center justify-center gap-2">
                          <Info className="w-4 h-4" />
                          TECHNICAL DETAILS
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-[#0a0a0c] border-2 border-zinc-900 rounded-none space-y-4" id="bikes-empty-state">
              <ShieldAlert className="w-12 h-12 text-zinc-650 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-zinc-300 uppercase italic">NO BIKES FOUND</h3>
                <p className="text-xs text-zinc-500 font-sans">Try modifying your search or select a different category filter above.</p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
