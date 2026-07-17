import React from "react";
import { Calendar, User as UserIcon, CalendarDays, KeyRound, Award, Settings } from "lucide-react";
import { User as UserType } from "../types";

interface ProfileProps {
  user: UserType | null;
  setCurrentView: (view: string) => void;
}

export default function Profile({ user, setCurrentView }: ProfileProps) {
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-left" id="profile-container">
      {/* Title */}
      <div className="space-y-3 mb-10 relative">
        <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-[0.03] overflow-hidden hidden sm:block">
          <span className="text-stroke-white text-[9rem] uppercase font-display font-black italic tracking-tighter block whitespace-nowrap">
            PROFILE
          </span>
        </div>
        <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">KTM RACING TEAM ID</span>
        <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none italic relative z-10">MY RIDER PROFILE</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Team ID badge cards */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="bg-ktm-orange h-[6px] w-full absolute top-0 left-0" />
            <div className="racing-stripe-orange-black h-[4px] w-full absolute top-[6px] left-0" />
            
            <div className="w-20 h-20 bg-zinc-900 border-2 border-zinc-800 rounded-none flex items-center justify-center text-ktm-orange font-display font-black italic text-4xl relative transform -skew-x-12">
              <span className="transform skew-x-12">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase tracking-tight leading-none italic">{user.name}</h2>
              <span className="inline-block px-3 py-1 bg-ktm-orange text-[10px] font-display font-black text-white tracking-widest uppercase transform -skew-x-12 mt-3 rounded-none">
                <div className="transform skew-x-12">{user.role} RIDER</div>
              </span>
            </div>
          </div>

          <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-6 space-y-3 font-mono text-[11px] text-zinc-500">
            <span className="text-white font-display font-black italic uppercase text-xs block mb-3 tracking-widest">MEMBER CREDENTIALS</span>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>REGISTERED ID:</span>
              <span className="text-zinc-300 font-bold">{user.id}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>ENROLL DATE:</span>
              <span className="text-zinc-300 font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>TEAM RANK:</span>
              <span className="text-ktm-orange font-display font-black italic">READY TO RACE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed parameters */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0a0a0c] border-2 border-zinc-900 rounded-none p-8 space-y-6">
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight pb-3 border-b-2 border-zinc-900 italic">Contact Specifics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block mb-1.5 tracking-wider">Email Address</span>
                <span className="text-white font-bold block bg-zinc-900/60 p-2 border border-zinc-850">{user.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block mb-1.5 tracking-wider">Rider Telephone</span>
                <span className="text-white font-bold block bg-zinc-900/60 p-2 border border-zinc-850">{user.phone || "N/A"}</span>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-zinc-900 space-y-4">
              <h4 className="font-display font-black text-white text-xs uppercase tracking-widest italic text-ktm-orange">Quick Shortcuts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView("bookings")}
                  className="p-5 bg-zinc-950 hover:bg-zinc-900 border-2 border-zinc-900 hover:border-ktm-orange rounded-none flex items-center gap-4 transition-all text-left cursor-pointer group transform -skew-x-12"
                >
                  <div className="transform skew-x-12 flex items-center gap-4 w-full">
                    <CalendarDays className="w-5 h-5 text-ktm-orange shrink-0" />
                    <div>
                      <span className="text-xs font-display font-black text-white block uppercase group-hover:text-ktm-orange transition-colors">My Bookings</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Check reserves & test rides</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView("bikes")}
                  className="p-5 bg-zinc-950 hover:bg-zinc-900 border-2 border-zinc-900 hover:border-ktm-orange rounded-none flex items-center gap-4 transition-all text-left cursor-pointer group transform -skew-x-12"
                >
                  <div className="transform skew-x-12 flex items-center gap-4 w-full">
                    <Award className="w-5 h-5 text-ktm-orange shrink-0" />
                    <div>
                      <span className="text-xs font-display font-black text-white block uppercase group-hover:text-ktm-orange transition-colors">KTM Showroom</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Discover new releases</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
