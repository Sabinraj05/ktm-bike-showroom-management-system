import React, { useState, useEffect, FormEvent } from "react";
import { 
  Users, CalendarDays, Bike as BikeIcon, MessageSquare, 
  Trash2, Check, X, Edit2, Plus, LayoutDashboard, ShieldCheck, 
  CircleDollarSign, Eye, RefreshCw 
} from "lucide-react";
import { Bike, User, Booking, ContactInquiry } from "../types";

interface AdminProps {
  user: User | null;
  bikes: Bike[];
  onRefreshBikes: () => void;
}

type AdminTab = "dashboard" | "bikes" | "bookings" | "users" | "contacts";

export default function Admin({ user, bikes, onRefreshBikes }: AdminProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allContacts, setAllContacts] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Bike Form Modal States
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  
  // Bike Form Fields
  const [bikeName, setBikeName] = useState("");
  const [bikeCategory, setBikeCategory] = useState("Naked");
  const [bikeEngine, setBikeEngine] = useState("");
  const [bikePower, setBikePower] = useState("");
  const [bikePrice, setBikePrice] = useState("");
  const [bikeImage, setBikeImage] = useState("");
  const [bikeDescription, setBikeDescription] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, bookingsRes, contactsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/bookings"),
        fetch("/api/contact")
      ]);

      if (usersRes.ok && bookingsRes.ok && contactsRes.ok) {
        const u = await usersRes.json();
        const b = await bookingsRes.json();
        const c = await contactsRes.json();
        setAllUsers(u);
        setAllBookings(b);
        setAllContacts(c);
      }
    } catch (err) {
      console.error("Error fetching admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchData();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6" id="admin-auth-gate">
        <div className="w-16 h-16 bg-[#0a0a0c] border-2 border-zinc-900 text-red-550 rounded-none flex items-center justify-center mx-auto shadow-lg shadow-red-600/5 transform -skew-x-12">
          <ShieldCheck className="w-7 h-7 transform skew-x-12" />
        </div>
        <div className="space-y-3 max-w-sm mx-auto">
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter italic">ADMIN ACCESS CONTROL</h2>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            Unauthorized access identified. This administrative cockpit is restricted to factory-authorized dealership administrators only.
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics metrics
  const totalUsers = allUsers.length;
  const totalBookings = allBookings.length;
  const totalContacts = allContacts.length;
  const activeBikes = bikes.length;
  const estimatedRevenue = allBookings
    .filter((b) => b.type === "Purchase" && b.status === "Confirmed")
    .reduce((sum, b) => {
      const matchedBike = bikes.find((item) => item.name === b.bikeName);
      return sum + (matchedBike ? matchedBike.price : 5000);
    }, 0);

  // Bike Modals Handlers
  const handleOpenAddBike = () => {
    setEditingBike(null);
    setBikeName("");
    setBikeCategory("Naked");
    setBikeEngine("");
    setBikePower("");
    setBikePrice("");
    setBikeImage("");
    setBikeDescription("");
    setIsBikeModalOpen(true);
  };

  const handleOpenEditBike = (bike: Bike) => {
    setEditingBike(bike);
    setBikeName(bike.name);
    setBikeCategory(bike.category);
    setBikeEngine(bike.engineSize);
    setBikePower(bike.power);
    setBikePrice(bike.price.toString());
    setBikeImage(bike.image);
    setBikeDescription(bike.description);
    setIsBikeModalOpen(true);
  };

  const handleSaveBike = async (e: FormEvent) => {
    e.preventDefault();
    if (!bikeName || !bikePrice || !bikeImage) {
      alert("Missing essential bike fields");
      return;
    }

    const payload = {
      name: bikeName,
      category: bikeCategory,
      engineSize: bikeEngine || "373 cc",
      power: bikePower || "44 HP",
      price: Number(bikePrice),
      image: bikeImage,
      description: bikeDescription,
      specs: editingBike?.specs || {
        displacement: bikeEngine || "373 cm³",
        transmission: "6-speed",
        cooling: "Liquid cooled",
        fuelCapacity: "14 L",
        weight: "150 kg"
      }
    };

    try {
      const endpoint = editingBike ? `/api/bikes/${editingBike.id}` : "/api/bikes";
      const method = editingBike ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save KTM Bike model");
      }

      onRefreshBikes();
      setIsBikeModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Error saving bike");
    }
  };

  const handleDeleteBike = async (id: string) => {
    if (!confirm("Are you sure you want to retire this KTM bike model from showroom?")) return;

    try {
      const response = await fetch(`/api/bikes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to retire bike");
      onRefreshBikes();
    } catch (err: any) {
      alert(err.message || "Error retiring bike");
    }
  };

  // Booking updates
  const handleUpdateBookingStatus = async (id: string, newStatus: "Confirmed" | "Completed" | "Cancelled") => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update booking");
      
      // Update local state
      setAllBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(err.message || "Error updating booking status");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to purge this booking archive?")) return;
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to purge booking");
      setAllBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || "Error purging booking");
    }
  };

  // User deletion
  const handleDeleteUser = async (id: string) => {
    if (id === "user-admin") {
      alert("System constraint: Cannot purge the primary root administrator.");
      return;
    }
    if (!confirm("Are you sure you want to permanently disable this user profile?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to disable user");
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.message || "Error disabling user");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="admin-cockpit-container">
      
      {/* Cockpit Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 text-left relative">
        <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-[0.03] overflow-hidden hidden sm:block">
          <span className="text-stroke-white text-[9rem] uppercase font-display font-black italic tracking-tighter block whitespace-nowrap">
            ADMIN COCKPIT
          </span>
        </div>
        <div className="space-y-2 relative z-10">
          <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block">KTM ORANGE COCKPIT SYSTEM</span>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic">ADMINISTRATIVE DASHBOARD</h1>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-3 bg-[#0a0a0c] hover:bg-white hover:text-black border-2 border-zinc-900 hover:border-white text-xs font-display font-black italic text-zinc-400 transition-all cursor-pointer uppercase shrink-0 transform -skew-x-12 relative z-10"
        >
          <div className="transform skew-x-12 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-ktm-orange" />
            Sync Live Database
          </div>
        </button>
      </div>

      {/* Cockpit Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 bg-[#0a0a0c] border-2 border-zinc-900 rounded-none mb-10 font-display font-black text-xs uppercase tracking-wider" id="admin-cockpit-tabs">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "bikes", label: "Manage Bikes", icon: BikeIcon },
          { id: "bookings", label: "Manage Bookings", icon: CalendarDays },
          { id: "users", label: "Manage Users", icon: Users },
          { id: "contacts", label: "Showroom Inquiries", icon: MessageSquare }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`py-3 px-4 rounded-none flex items-center justify-center gap-2 transition-all cursor-pointer transform -skew-x-12 border ${
                isActive
                  ? "bg-ktm-orange text-white border-ktm-orange"
                  : "text-zinc-500 hover:text-white border-transparent hover:bg-zinc-900"
              }`}
              id={`admin-tab-btn-${tab.id}`}
            >
              <div className="transform skew-x-12 flex items-center gap-2">
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500 font-mono text-xs">
          SYNCHRONIZING SECURE COCKPIT REGISTERS...
        </div>
      ) : (
        <div className="animate-fade-in" id="admin-view-viewport">
          
          {/* TAB 1: DASHBOARD METRICS OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 text-left" id="admin-dashboard-view">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric: Bikes */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 p-6 rounded-none flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-black text-zinc-500 uppercase tracking-widest block">Active Showcase</span>
                    <span className="text-3xl font-display font-black italic uppercase tracking-tight text-white block">{activeBikes} Models</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-ktm-orange rounded-none transform -skew-x-12">
                    <BikeIcon className="w-6 h-6 transform skew-x-12" />
                  </div>
                </div>

                {/* Metric: Bookings */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 p-6 rounded-none flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-black text-zinc-500 uppercase tracking-widest block">Logged Reserves</span>
                    <span className="text-3xl font-display font-black italic uppercase tracking-tight text-white block">{totalBookings} Entries</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-ktm-orange rounded-none transform -skew-x-12">
                    <CalendarDays className="w-6 h-6 transform skew-x-12" />
                  </div>
                </div>

                {/* Metric: Users */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 p-6 rounded-none flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-black text-zinc-500 uppercase tracking-widest block">Registered Riders</span>
                    <span className="text-3xl font-display font-black italic uppercase tracking-tight text-white block">{totalUsers} Users</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-ktm-orange rounded-none transform -skew-x-12">
                    <Users className="w-6 h-6 transform skew-x-12" />
                  </div>
                </div>

                {/* Metric: Estimated Revenue */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 p-6 rounded-none flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-black text-zinc-500 uppercase tracking-widest block">Reserve Volume</span>
                    <span className="text-3xl font-display font-black italic uppercase tracking-tight text-emerald-400 block">${estimatedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-900 text-emerald-450 rounded-none transform -skew-x-12">
                    <CircleDollarSign className="w-6 h-6 transform skew-x-12" />
                  </div>
                </div>

              </div>

              {/* Sub grid for quick tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Bookings Box */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <h3 className="font-display font-black text-white text-base uppercase italic tracking-tight">Recent Showroom Actions</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-xs font-display font-black italic text-ktm-orange hover:underline uppercase tracking-wider">Full Logs</button>
                  </div>
                  {allBookings.length > 0 ? (
                    <div className="divide-y divide-zinc-900 text-xs font-mono">
                      {allBookings.slice(0, 4).map((b) => (
                        <div key={b.id} className="py-3 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block uppercase tracking-tight">{b.bikeName}</span>
                            <span className="text-zinc-500 text-[10px] uppercase">{b.userName} • {b.type}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-none text-[9px] font-display font-black border uppercase tracking-wider transform -skew-x-12 ${
                            b.status === "Confirmed" ? "bg-emerald-950/45 text-emerald-400 border-emerald-900/50" :
                            b.status === "Cancelled" ? "bg-red-950/45 text-red-400 border-red-900/50" : "bg-zinc-900 text-zinc-400 border-zinc-850"
                          }`}>
                            <div className="transform skew-x-12">{b.status}</div>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 py-4 font-sans">No active showroom logs detected.</p>
                  )}
                </div>

                {/* Dealer Inquiries Box */}
                <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-5">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                    <h3 className="font-display font-black text-white text-base uppercase italic tracking-tight">Dealership Inquiries</h3>
                    <button onClick={() => setActiveTab("contacts")} className="text-xs font-display font-black italic text-ktm-orange hover:underline uppercase tracking-wider">View All</button>
                  </div>
                  {allContacts.length > 0 ? (
                    <div className="divide-y divide-zinc-900 text-xs">
                      {allContacts.slice(0, 4).map((c) => (
                        <div key={c.id} className="py-3 space-y-1.5">
                          <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                            <span>{c.name}</span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <span className="font-display font-black text-white text-sm block truncate italic uppercase">{c.subject}</span>
                          <p className="text-zinc-450 text-xs truncate leading-tight font-sans">"{c.message}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 py-4 font-sans">No messages registered.</p>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MANAGE BIKES */}
          {activeTab === "bikes" && (
            <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-6 text-left" id="admin-bikes-view">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">Showcase Catalog Management</h2>
                <button
                  onClick={handleOpenAddBike}
                  className="px-4 py-2.5 bg-ktm-orange hover:bg-white text-white hover:text-black rounded-none text-xs font-display font-black italic uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer transform -skew-x-12 shadow-lg shadow-orange-600/10 border border-transparent hover:border-zinc-800"
                  id="admin-btn-add-bike"
                >
                  <div className="transform skew-x-12 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    Add KTM Model
                  </div>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-none border-2 border-zinc-900 bg-zinc-950/20">
                <table className="w-full text-xs text-left text-zinc-450 font-mono">
                  <thead className="bg-[#0f0f12] text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-900">
                    <tr>
                      <th className="p-4 font-display font-black">Image</th>
                      <th className="p-4 font-display font-black">Model Name</th>
                      <th className="p-4 font-display font-black">Category</th>
                      <th className="p-4 font-display font-black">Engine</th>
                      <th className="p-4 font-display font-black">Power</th>
                      <th className="p-4 font-display font-black">Price</th>
                      <th className="p-4 font-display font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {bikes.map((bike) => (
                      <tr key={bike.id} className="hover:bg-[#0c0c0e] transition-colors">
                        <td className="p-4">
                          <img src={bike.image} alt={bike.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-none border border-zinc-800 transform -skew-x-12" />
                        </td>
                        <td className="p-4 font-display font-black text-white uppercase italic text-sm">{bike.name}</td>
                        <td className="p-4 text-zinc-300 font-bold uppercase">{bike.category}</td>
                        <td className="p-4 font-bold">{bike.engineSize}</td>
                        <td className="p-4 font-bold">{bike.power}</td>
                        <td className="p-4 font-display font-black text-ktm-orange text-sm">${bike.price.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleOpenEditBike(bike)}
                              className="p-1.5 bg-zinc-900 hover:bg-ktm-orange hover:text-black border border-zinc-800 rounded-none transition-colors cursor-pointer"
                              id={`admin-btn-edit-${bike.id}`}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBike(bike.id)}
                              className="p-1.5 bg-red-950/20 hover:bg-red-900 hover:text-white border border-red-900/40 rounded-none transition-colors cursor-pointer text-red-405"
                              id={`admin-btn-delete-${bike.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add / Edit Bike Modal Overlay */}
              {isBikeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" id="bike-crud-modal">
                  <div className="relative w-full max-w-lg bg-[#0a0a0c] border-2 border-zinc-800 rounded-none overflow-hidden ktm-box-glow text-left">
                    <div className="bg-ktm-orange h-3 w-full" />
                    <div className="racing-stripe-orange-black h-2 w-full"></div>
                    
                    <form onSubmit={handleSaveBike} className="p-8 space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">
                          {editingBike ? "EDIT SHOWCASE MODEL" : "ADD NEW KTM MODEL"}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsBikeModalOpen(false)}
                          className="p-1.5 bg-zinc-900 hover:bg-ktm-orange hover:text-black border border-zinc-800 rounded-none text-zinc-450 text-xs font-display font-black transition-colors"
                        >
                          X
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Model Name</label>
                          <input
                            type="text"
                            required
                            placeholder="KTM 390 Duke"
                            value={bikeName}
                            onChange={(e) => setBikeName(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                            id="crud-input-name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Category Series</label>
                          <select
                            value={bikeCategory}
                            onChange={(e) => setBikeCategory(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-mono cursor-pointer"
                            id="crud-input-category"
                          >
                            <option>Naked</option>
                            <option>Supersport</option>
                            <option>Adventure</option>
                            <option>Motocross</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Displacement</label>
                          <input
                            type="text"
                            placeholder="373 cc"
                            value={bikeEngine}
                            onChange={(e) => setBikeEngine(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                            id="crud-input-engine"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Engine Power</label>
                          <input
                            type="text"
                            placeholder="44 HP"
                            value={bikePower}
                            onChange={(e) => setBikePower(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                            id="crud-input-power"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Price (USD)</label>
                          <input
                            type="number"
                            required
                            placeholder="5899"
                            value={bikePrice}
                            onChange={(e) => setBikePrice(e.target.value)}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-mono placeholder-zinc-650"
                            id="crud-input-price"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Product Image URL</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={bikeImage}
                          onChange={(e) => setBikeImage(e.target.value)}
                          className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-mono placeholder-zinc-650"
                          id="crud-input-image"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-display font-black text-zinc-450 uppercase tracking-widest mb-1.5">Description / Catchphrase</label>
                        <textarea
                          rows={3}
                          placeholder="The Corner Rocket..."
                          value={bikeDescription}
                          onChange={(e) => setBikeDescription(e.target.value)}
                          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                          id="crud-input-desc"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none font-display font-black italic uppercase text-xs tracking-widest transition-all cursor-pointer transform -skew-x-12 shadow-lg"
                        id="crud-btn-submit"
                      >
                        <div className="transform skew-x-12">
                          {editingBike ? "CONFIRM UPDATE" : "PUBLISH TO SHOWROOM"}
                        </div>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-6 text-left" id="admin-bookings-view">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic border-b border-zinc-900 pb-4">Rider Booking & Reserve Registry</h2>
              
              {allBookings.length > 0 ? (
                <div className="overflow-x-auto rounded-none border-2 border-zinc-900 bg-zinc-950/20">
                  <table className="w-full text-xs text-left text-zinc-450 font-mono">
                    <thead className="bg-[#0f0f12] text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-900">
                      <tr>
                        <th className="p-4 font-display font-black">Rider Details</th>
                        <th className="p-4 font-display font-black">KTM Model</th>
                        <th className="p-4 font-display font-black">Type</th>
                        <th className="p-4 font-display font-black">Date & Slot</th>
                        <th className="p-4 font-display font-black">Status</th>
                        <th className="p-4 font-display font-black text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {allBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#0c0c0e] transition-colors">
                          <td className="p-4">
                            <div className="font-display font-black text-white uppercase italic text-sm">{b.userName}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{b.userEmail} • {b.userPhone}</div>
                          </td>
                          <td className="p-4 font-display font-black text-zinc-300 uppercase italic">{b.bikeName}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-none text-[9px] font-display font-black uppercase transform -skew-x-12 inline-block ${
                              b.type === "Test Ride" ? "bg-ktm-orange text-white" : "bg-white text-zinc-950"
                            }`}>
                              <div className="transform skew-x-12">{b.type}</div>
                            </span>
                          </td>
                          <td className="p-4 font-bold">
                            <div>{b.date}</div>
                            {b.timeSlot && <div className="text-[10px] text-zinc-500 font-mono font-medium mt-0.5">{b.timeSlot}</div>}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-none text-[10px] font-display font-black border uppercase tracking-wider transform -skew-x-12 inline-block ${
                              b.status === "Confirmed" ? "bg-emerald-950/45 text-emerald-400 border-emerald-900/50" :
                              b.status === "Cancelled" ? "bg-red-950/45 text-red-400 border-red-900/50" :
                              b.status === "Completed" ? "bg-blue-950/45 text-blue-400 border-blue-900/50" : "bg-zinc-900 text-zinc-400 border-zinc-850"
                            }`}>
                              <div className="transform skew-x-12">{b.status}</div>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {b.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                                    className="p-1.5 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 rounded-none text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                    title="Confirm Booking"
                                    id={`admin-btn-confirm-${b.id}`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                                    className="p-1.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded-none text-red-400 hover:text-red-350 transition-colors cursor-pointer"
                                    title="Reject / Cancel"
                                    id={`admin-btn-reject-${b.id}`}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              {b.status === "Confirmed" && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, "Completed")}
                                  className="px-2.5 py-1 bg-blue-950/30 hover:bg-blue-900/40 border border-blue-900/40 rounded-none text-blue-400 hover:text-blue-300 text-[10px] font-display font-black uppercase italic tracking-wider transition-colors cursor-pointer animate-pulse transform -skew-x-12"
                                  title="Mark Completed"
                                  id={`admin-btn-complete-${b.id}`}
                                >
                                  <div className="transform skew-x-12">Done</div>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-none text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete Record"
                                id={`admin-btn-purge-${b.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-zinc-500 py-10">No bookings have been logged yet.</p>
              )}
            </div>
          )}

          {/* TAB 4: MANAGE USERS */}
          {activeTab === "users" && (
            <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-6 text-left" id="admin-users-view">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic border-b border-zinc-900 pb-4">Dealership Registered Riders</h2>
              
              <div className="overflow-x-auto rounded-none border-2 border-zinc-900 bg-zinc-950/20">
                <table className="w-full text-xs text-left text-zinc-450 font-mono">
                  <thead className="bg-[#0f0f12] text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-900">
                    <tr>
                      <th className="p-4 font-display font-black">Rider Name</th>
                      <th className="p-4 font-display font-black">Email</th>
                      <th className="p-4 font-display font-black">Phone Number</th>
                      <th className="p-4 font-display font-black">Role</th>
                      <th className="p-4 font-display font-black">Enrolled</th>
                      <th className="p-4 font-display font-black text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#0c0c0e] transition-colors">
                        <td className="p-4 font-display font-black text-white uppercase italic text-sm">{u.name}</td>
                        <td className="p-4 text-zinc-300 font-bold">{u.email}</td>
                        <td className="p-4 font-medium">{u.phone}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-none text-[9px] font-display font-black uppercase transform -skew-x-12 inline-block ${
                            u.role === "ADMIN" ? "bg-red-955 text-red-400 border border-red-900/30" : "bg-zinc-900 text-zinc-400"
                          }`}>
                            <div className="transform skew-x-12">{u.role}</div>
                          </span>
                        </td>
                        <td className="p-4 text-zinc-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          {u.role !== "ADMIN" && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded-none text-red-450 transition-colors cursor-pointer"
                              id={`admin-user-delete-${u.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SHOWROOM INQUIRIES */}
          {activeTab === "contacts" && (
            <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-6 text-left" id="admin-contacts-view">
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic border-b border-zinc-900 pb-4">Rider Showroom Inquiries</h2>
              
              {allContacts.length > 0 ? (
                <div className="space-y-5" id="admin-contacts-list">
                  {allContacts.map((c) => (
                    <div key={c.id} className="bg-[#0c0c0e] border-2 border-zinc-900 p-6 rounded-none space-y-4 relative hover:border-zinc-850 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base font-display font-black text-white uppercase italic">{c.name}</h3>
                          <p className="text-[10px] text-zinc-550 font-mono mt-1">{c.email} • {c.phone}</p>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-550">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="p-4.5 bg-black border border-zinc-900 rounded-none space-y-1.5 text-xs font-mono">
                        <span className="text-[10px] font-display font-black text-ktm-orange uppercase tracking-widest block">SUBJECT: {c.subject}</span>
                        <p className="text-zinc-300 leading-relaxed font-sans">"{c.message}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 py-10 font-sans">No inquiries registered in logs.</p>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
