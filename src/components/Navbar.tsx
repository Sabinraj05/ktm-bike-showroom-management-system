import { Menu, X, LogOut, User as UserIcon, Shield, CalendarDays } from "lucide-react";
import { useState } from "react";
import { User } from "../types";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ currentView, setCurrentView, user, onLogout, onOpenAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "bikes", label: "BIKES" },
    { id: "contact", label: "CONTACT" }
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-black/95 border-b-2 border-zinc-900 backdrop-blur-md" id="app-navbar">
      <div className="racing-stripe w-full"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => handleNavClick("home")} id="nav-logo">
            <span className="text-4xl font-display font-black italic tracking-tighter text-white uppercase">
              K<span className="text-ktm-orange text-5xl">T</span>M
            </span>
            <div className="ml-3 pl-3 border-l-2 border-zinc-800 text-[10px] tracking-[0.3em] font-mono text-zinc-400 uppercase leading-snug">
              READY TO<br />
              <span className="text-ktm-orange font-black">RACE</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" id="nav-desktop-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-base font-display font-black italic tracking-wider hover:text-ktm-orange transition-colors cursor-pointer relative py-2 uppercase ${
                  currentView === item.id 
                    ? "text-white text-shadow-glow" 
                    : "text-zinc-400"
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {currentView === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-ktm-orange skew-x-[-15deg]" />
                )}
              </button>
            ))}
          </div>

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4" id="nav-desktop-user">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Profile Button */}
                <button
                  onClick={() => handleNavClick("profile")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-display font-bold italic uppercase transition-all cursor-pointer transform -skew-x-12 border ${
                    currentView === "profile" 
                      ? "bg-zinc-900 border-ktm-orange text-white" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                  id="nav-btn-profile"
                >
                  <div className="transform skew-x-12 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-ktm-orange" />
                    <span className="max-w-[120px] truncate">{user.name}</span>
                  </div>
                </button>

                {/* Booking shortcuts for standard user */}
                {user.role === "USER" && (
                  <button
                    onClick={() => handleNavClick("bookings")}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-display font-black italic tracking-wider uppercase transition-all cursor-pointer transform -skew-x-12 border ${
                      currentView === "bookings"
                        ? "bg-zinc-900 border-ktm-orange text-ktm-orange"
                        : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                    id="nav-btn-my-bookings"
                  >
                    <div className="transform skew-x-12 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-ktm-orange" />
                      MY RIDES
                    </div>
                  </button>
                )}

                {/* Admin Button */}
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => handleNavClick("admin")}
                    className={`flex items-center gap-2 px-5 py-2.5 bg-ktm-orange text-white hover:bg-orange-600 rounded-sm text-sm font-display font-black italic uppercase transition-all cursor-pointer transform -skew-x-12`}
                    id="nav-btn-admin"
                  >
                    <div className="transform skew-x-12 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      DASHBOARD
                    </div>
                  </button>
                )}

                {/* Logout */}
                <button
                  onClick={onLogout}
                  className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
                  title="Logout"
                  id="nav-btn-logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-6 py-2.5 bg-ktm-orange text-white hover:bg-orange-600 rounded-sm font-display font-black italic tracking-widest text-sm transition-all cursor-pointer uppercase transform -skew-x-12"
                id="nav-btn-login"
              >
                <div className="transform skew-x-12">
                  SIGN IN
                </div>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-zinc-400 hover:text-white p-2"
              id="nav-btn-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0c] border-b-2 border-zinc-900 py-5 px-4 space-y-3" id="nav-mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-5 py-3 rounded-sm text-base font-display font-black italic tracking-widest uppercase ${
                currentView === item.id 
                  ? "bg-zinc-900/60 text-ktm-orange border-l-4 border-ktm-orange" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
              id={`nav-mobile-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}

          {user && user.role === "USER" && (
            <button
              onClick={() => handleNavClick("bookings")}
              className={`block w-full text-left px-5 py-3 rounded-sm text-base font-display font-black italic tracking-widest uppercase ${
                currentView === "bookings" 
                  ? "bg-zinc-900/60 text-ktm-orange border-l-4 border-ktm-orange" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              MY BOOKINGS
            </button>
          )}

          {user && user.role === "ADMIN" && (
            <button
              onClick={() => handleNavClick("admin")}
              className={`block w-full text-left px-5 py-3 rounded-sm text-base font-display font-black italic tracking-widest uppercase ${
                currentView === "admin" 
                  ? "bg-ktm-orange text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              ADMIN DASHBOARD
            </button>
          )}

          {user && (
            <button
              onClick={() => handleNavClick("profile")}
              className={`block w-full text-left px-5 py-3 rounded-sm text-base font-display font-black italic tracking-widest uppercase ${
                currentView === "profile" 
                  ? "bg-zinc-900/60 text-ktm-orange border-l-4 border-ktm-orange" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              PROFILE ({user.name})
            </button>
          )}

          <div className="pt-4 border-t border-zinc-900">
            {user ? (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-850 text-white rounded-sm font-display font-black italic uppercase tracking-wider text-sm transition-all"
                id="nav-mobile-btn-logout"
              >
                <LogOut className="w-4 h-4 text-ktm-orange" />
                LOGOUT
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-3.5 px-4 bg-ktm-orange text-white hover:bg-orange-600 rounded-sm font-display font-black italic uppercase tracking-wider text-sm transition-all text-center shadow-lg shadow-orange-600/10"
                id="nav-mobile-btn-login"
              >
                SIGN IN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
