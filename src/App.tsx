import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Bikes from "./components/Bikes";
import Bookings from "./components/Bookings";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import Profile from "./components/Profile";
import AuthModal from "./components/AuthModal";
import { Bike, User } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ktm_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("ktm_user");
      }
    }
  }, []);

  // Fetch bikes from Express backend api
  const fetchBikes = async () => {
    try {
      const response = await fetch("/api/bikes");
      const data = await response.json();
      if (response.ok) {
        setBikes(data);
      }
    } catch (err) {
      console.error("Error fetching KTM showroom bikes:", err);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem("ktm_user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ktm_user");
    setCurrentView("home");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0b] text-zinc-100" id="app-root-element">
      
      {/* 1. Header & Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 2. Main content router */}
      <main className="flex-grow">
        {currentView === "home" && (
          <Home
            setCurrentView={setCurrentView}
            bikes={bikes}
            onSelectBike={(b) => {
              setSelectedBike(b);
              setCurrentView("bikes");
            }}
            setCategoryFilter={setCategoryFilter}
          />
        )}

        {currentView === "bikes" && (
          <Bikes
            user={user}
            bikes={bikes}
            selectedBike={selectedBike}
            onSelectBike={setSelectedBike}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === "bookings" && (
          <Bookings
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === "contact" && (
          <Contact />
        )}

        {currentView === "profile" && (
          <Profile
            user={user}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === "admin" && (
          <Admin
            user={user}
            bikes={bikes}
            onRefreshBikes={fetchBikes}
          />
        )}
      </main>

      {/* 3. Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
