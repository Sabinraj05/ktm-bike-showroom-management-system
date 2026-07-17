import React, { useState } from "react";
import { X, Lock, Mail, Phone, User, LogIn, UserPlus } from "lucide-react";
import { User as UserType } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const payload = isLogin 
        ? { email, password } 
        : { name, email, phone, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      // Success
      const loggedUser = data.user;
      onLoginSuccess(loggedUser);
      onClose();
      // Clear form
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0a0a0c] border-2 border-zinc-800 rounded-none overflow-hidden ktm-box-glow">
        {/* Banner */}
        <div className="bg-ktm-orange h-3 w-full" />
        <div className="racing-stripe-orange-black h-2 w-full"></div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors p-1 bg-zinc-900 border border-zinc-800 rounded-none font-display font-black text-xs"
          id="btn-close-auth"
        >
          X
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-black text-white tracking-tighter uppercase italic leading-none">
              {isLogin ? "WELCOME BACK" : "JOIN THE TEAM"}
            </h2>
            <p className="text-zinc-500 text-xs mt-2 font-sans">
              {isLogin ? "Log in to access bookings & test rides" : "Register to start your KTM Ready to Race journey"}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-zinc-950 p-2 border border-zinc-900 rounded-none">
            <button
              onClick={() => { setIsLogin(true); setError(""); }}
              className={`py-2.5 px-4 rounded-none font-display font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 transform -skew-x-12 cursor-pointer ${
                isLogin 
                  ? "bg-ktm-orange text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
              id="tab-btn-login"
            >
              <div className="transform skew-x-12 flex items-center justify-center gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                Login
              </div>
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(""); }}
              className={`py-2.5 px-4 rounded-none font-display font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 transform -skew-x-12 cursor-pointer ${
                !isLogin 
                  ? "bg-ktm-orange text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
              id="tab-btn-register"
            >
              <div className="transform skew-x-12 flex items-center justify-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/40 border-2 border-red-900/50 text-red-400 text-xs rounded-none font-mono" id="auth-error">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-white text-xs focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                    id="auth-input-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="racer@ktm.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-white text-xs focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="auth-input-email"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-white text-xs focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                    id="auth-input-phone"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-display font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-none text-white text-xs focus:outline-none focus:border-ktm-orange font-sans placeholder-zinc-650"
                  id="auth-input-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-ktm-orange text-white hover:bg-white hover:text-black rounded-none font-display font-black italic uppercase text-xs tracking-widest transition-all cursor-pointer transform -skew-x-12 shadow-lg shadow-orange-600/20 disabled:opacity-50"
              id="auth-btn-submit"
            >
              <div className="transform skew-x-12">
                {loading ? "AUTHENTICATING..." : isLogin ? "LOGIN" : "REGISTER"}
              </div>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-zinc-900 text-center">
              <span className="text-zinc-600 text-[10px] font-display font-black uppercase tracking-wider block mb-2">Demo Credentials</span>
              <div className="flex flex-col gap-1.5 text-xs text-zinc-450 justify-center font-mono">
                <p>
                  <span className="text-ktm-orange font-bold uppercase">Rider:</span> alex@example.com / password123
                </p>
                <p>
                  <span className="text-ktm-orange font-bold uppercase">Admin:</span> admin@ktm.com / admin123
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
