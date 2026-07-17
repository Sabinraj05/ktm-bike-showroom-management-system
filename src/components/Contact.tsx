import React, { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ShieldAlert, Navigation } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const dealers = [
    {
      id: "dealer-1",
      name: "KTM Mattighofen Flagship (HQ)",
      address: "100 KTM Orange Way, Mattighofen, Austria 5230",
      phone: "+43 7742 6000",
      email: "hq@ktm.com",
      coords: "48.1066° N, 13.1506° E",
      photo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "dealer-2",
      name: "KTM California Speed Hub",
      address: "3845 Orange Express Blvd, Irvine, CA 92618",
      phone: "+1 800-555-0199",
      email: "cali@ktm.com",
      coords: "33.6846° N, 117.8265° W",
      photo: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "dealer-3",
      name: "KTM Mumbai Pro Racing",
      address: "G-10, Terminal Trade Center, Andheri East, Mumbai 400069",
      phone: "+91 22-5555-0144",
      email: "mumbai@ktm.com",
      coords: "19.1136° N, 72.8697° E",
      photo: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const [selectedDealer, setSelectedDealer] = useState(dealers[0]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="contact-page-container">
      
      {/* Header */}
      <div className="text-left space-y-3 relative mb-12">
        <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-[0.03] overflow-hidden hidden sm:block">
          <span className="text-stroke-white text-[9rem] uppercase font-display font-black italic tracking-tighter block whitespace-nowrap">
            CONTACTS
          </span>
        </div>
        <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">CONNECT WITH RACING EXPERTS</span>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic relative z-10">CONTACT & LOCATOR</h1>
        <p className="text-zinc-400 text-sm max-w-xl font-sans relative z-10">
          Do you have questions about custom exhausts, delivery dates, or tech specifications? Submit our contact form or query our dealerships.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Grid: Contact Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-8 space-y-6 text-left">
          <div>
            <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">RIDER INQUIRY FORM</h2>
            <p className="text-xs text-zinc-500 mt-1 font-sans">We respond to certified factory inquiries within 12-24 business hours.</p>
          </div>

          {success ? (
            <div className="p-6 bg-[#0c0c0e] border border-zinc-850 rounded-none text-center space-y-4" id="contact-success-view">
              <div className="w-12 h-12 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 rounded-none flex items-center justify-center mx-auto transform -skew-x-12">
                <CheckCircle className="w-6 h-6 transform skew-x-12" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black text-white uppercase italic">INQUIRY SUBMITTED!</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Your details have been successfully transmitted to our team. Ready to race!
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none text-xs font-display font-black italic uppercase tracking-widest transition-colors transform -skew-x-12 cursor-pointer"
                id="contact-success-close"
              >
                <div className="transform skew-x-12">Send New Message</div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="contact-feedback-form">
              {error && (
                <div className="p-3 bg-red-950/40 border-2 border-red-900/50 text-red-400 text-xs rounded-none font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="contact-input-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                    id="contact-input-email"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                    id="contact-input-phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KTM 390 Duke Delivery Time"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="contact-input-subject"
                />
              </div>

              <div>
                <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-wider mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-white focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="contact-input-message"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none font-display font-black italic uppercase text-xs tracking-widest transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transform -skew-x-12 shadow-lg shadow-orange-600/10"
                id="contact-btn-submit"
              >
                <div className="transform skew-x-12 flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  {loading ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
                </div>
              </button>
            </form>
          )}
        </div>

        {/* Right Grid: Interactive Dealer Locator & Custom Google Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 text-left" id="showroom-locator-map-panel">
          <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic">KTM DEALERSHIP LOCATOR</h2>
              <p className="text-xs text-zinc-500 mt-1 font-sans">Select an active dealership hub to sync our interactive radar maps.</p>
            </div>

            {/* Dealer Buttons Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-zinc-950 p-2 border border-zinc-900 rounded-none">
              {dealers.map((dealer) => {
                const isSelected = selectedDealer.id === dealer.id;
                return (
                  <button
                    key={dealer.id}
                    onClick={() => setSelectedDealer(dealer)}
                    className={`py-2.5 px-3 rounded-none font-display font-black text-xs transition-all uppercase cursor-pointer truncate transform -skew-x-12 ${
                      isSelected
                        ? "bg-ktm-orange text-white"
                        : "text-zinc-500 hover:text-white hover:bg-zinc-900"
                    }`}
                    id={`dealer-tab-${dealer.id}`}
                  >
                    <div className="transform skew-x-12">{dealer.name.split(" ")[1]} Dealer</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Simulated Interactive Google Map */}
            <div className="relative h-64 bg-[#08080a] border-2 border-zinc-900 rounded-none overflow-hidden flex items-center justify-center text-center p-6 animate-pulse-subtle" id="simulated-google-map">
              {/* Map grid aesthetic */}
              <div className="absolute inset-0 bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:16px_16px] opacity-80" />
              
              {/* Fake Roads and pins */}
              <div className="absolute top-1/3 left-0 w-full h-[2px] bg-zinc-900" />
              <div className="absolute left-1/2 top-0 w-[2px] h-full bg-zinc-900" />
              <div className="absolute left-1/4 top-1/4 w-[1px] h-full bg-zinc-900/40 rotate-45" />

              {/* Glowing active pinpoint */}
              <div className="absolute z-10 flex flex-col items-center animate-bounce">
                <div className="p-3 bg-ktm-orange text-white rounded-none shadow-lg shadow-orange-600/50 border-2 border-black transform -skew-x-12">
                  <MapPin className="w-5 h-5 transform skew-x-12" />
                </div>
                <div className="h-2.5 w-2.5 bg-ktm-orange rounded-full animate-ping mt-1" />
              </div>

              {/* Watermark Details */}
              <div className="absolute bottom-4 left-4 bg-black border border-zinc-800 p-3 rounded-none flex items-center gap-2 max-w-xs text-left z-10 shadow-2xl transform -skew-x-12">
                <div className="transform skew-x-12 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-ktm-orange shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-display font-black text-zinc-500 uppercase tracking-widest block">RADAR TARGET</span>
                    <span className="text-[10px] font-mono text-zinc-300 font-bold block">{selectedDealer.coords}</span>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-1 z-10 font-mono text-[9px] text-zinc-500 uppercase bg-black/95 px-3 py-2 rounded-none border border-zinc-900">
                <span>ZOOM: 15x</span>
                <span className="text-ktm-orange">GRID: ACTIVE</span>
              </div>
            </div>

            {/* Dealership Details Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs font-mono">
              <div className="space-y-3">
                <h3 className="text-base font-display font-black text-white uppercase tracking-tight italic font-sans">{selectedDealer.name}</h3>
                <div className="space-y-2.5 text-zinc-400 font-sans text-xs leading-relaxed">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-ktm-orange shrink-0 mt-0.5" />
                    <span>{selectedDealer.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-ktm-orange shrink-0" />
                    <span>{selectedDealer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-ktm-orange shrink-0" />
                    <span>{selectedDealer.email}</span>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-zinc-950/40 border-2 border-zinc-900 p-4 rounded-none flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3 text-white font-display font-black uppercase text-xs tracking-wider italic">
                  <Clock className="w-4 h-4 text-ktm-orange" />
                  <span>Showroom Availability</span>
                </div>
                <div className="space-y-2 text-[11px] text-zinc-450 font-mono">
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>MON - FRI:</span>
                    <span className="text-white">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span>SATURDAY:</span>
                    <span className="text-white">10:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between text-ktm-orange font-bold">
                    <span>SUNDAY:</span>
                    <span>CLOSED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
