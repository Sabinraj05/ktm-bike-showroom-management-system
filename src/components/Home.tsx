import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star, ShieldCheck, Zap, Navigation, Award, MessageSquareQuote } from "lucide-react";
import { Bike } from "../types";

interface HomeProps {
  setCurrentView: (view: string) => void;
  bikes: Bike[];
  onSelectBike: (bike: Bike) => void;
  setCategoryFilter: (category: string) => void;
}

export default function Home({ setCurrentView, bikes, onSelectBike, setCategoryFilter }: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "THE CORNER ROCKET",
      subtitle: "KTM 390 DUKE",
      text: "Light as a feather, powerful and packed with state-of-the-art technology, it guarantees a thrilling ride.",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      linkId: "bike-1"
    },
    {
      title: "UNLEASH THE BEAST",
      subtitle: "KTM 1290 SUPER DUKE R",
      text: "Boasting 180 HP, the flagship naked model is stripped back, aggressive, and engineered for pure performance.",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      linkId: "bike-2"
    },
    {
      title: "THE ULTIMATE ESCAPE",
      subtitle: "KTM 890 ADVENTURE",
      text: "Master any trail, cross continents, and conquer the unexplored with supreme off-road capabilities.",
      image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80",
      linkId: "bike-4"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Categories
  const categories = [
    { name: "Naked", desc: "Pure aggressive street power", count: "3 Models", icon: Zap, bg: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=400&q=80" },
    { name: "Supersport", desc: "Race track inspired agility", count: "1 Model", icon: Award, bg: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=400&q=80" },
    { name: "Adventure", desc: "Cross any terrain, conquer off-road", count: "1 Model", icon: Navigation, bg: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=400&q=80" },
    { name: "Motocross", desc: "Championship winning dirt weapons", count: "1 Model", icon: ShieldCheck, bg: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80" }
  ];

  const handleCategoryClick = (categoryName: string) => {
    setCategoryFilter(categoryName);
    setCurrentView("bikes");
  };

  // Top featured bikes
  const featuredBikes = bikes.slice(0, 3);
  const latestBikes = bikes.slice(3, 6);

  const reviews = [
    {
      name: "Marcus Aurelius",
      rating: 5,
      date: "July 12, 2026",
      text: "The KTM 1290 Super Duke R is an absolute monster. The showroom buying process was extremely clean, professional, and rapid. Booked a test ride online first and within 2 hours I was at the dealership!",
      bike: "KTM 1290 Super Duke R"
    },
    {
      name: "Sophia Rodriguez",
      rating: 5,
      date: "June 28, 2026",
      text: "Picked up my KTM 390 Duke last week. This platform made it so easy to compare specs, find the bike, and reserve my purchase. Excellent service and support from the team.",
      bike: "KTM 390 Duke"
    },
    {
      name: "Nikhil Joshi",
      rating: 4,
      date: "May 15, 2026",
      text: "Fantastic experience booking an off-road adventure test ride. The staff set up the bike perfectly for my height and spent 30 minutes explaining all the tech and suspension. Highly recommended!",
      bike: "KTM 890 Adventure"
    }
  ];

  return (
    <div className="space-y-20 pb-16" id="home-page-container">
      
      {/* HERO SLIDER SECTION */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black" id="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Dark Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl md:max-w-2xl space-y-6">
                  <span className="inline-block px-4 py-1.5 bg-ktm-orange text-white text-xs font-display font-black tracking-[0.2em] uppercase transform -skew-x-12">
                    <div className="transform skew-x-12">READY TO RACE</div>
                  </span>
                  <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none uppercase italic">
                      {slide.title}
                    </h1>
                    <h2 className="text-3xl md:text-5xl font-display font-black text-ktm-orange uppercase tracking-tight italic">
                      {slide.subtitle}
                    </h2>
                  </div>
                  <p className="text-zinc-300 text-base md:text-lg">
                    {slide.text}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => {
                        const b = bikes.find(item => item.id === slide.linkId);
                        if (b) {
                          onSelectBike(b);
                          setCurrentView("bikes");
                        } else {
                          setCurrentView("bikes");
                        }
                      }}
                      className="px-8 py-4 bg-ktm-orange hover:bg-white text-white hover:text-black rounded-sm font-display font-black italic uppercase text-sm tracking-widest flex items-center gap-2 transition-all transform -skew-x-12 shadow-lg shadow-orange-600/30 cursor-pointer"
                    >
                      <div className="transform skew-x-12 flex items-center gap-2">
                        EXPLORE BIKE
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                    <button
                      onClick={() => setCurrentView("bikes")}
                      className="px-8 py-4 bg-transparent hover:bg-white border-2 border-white hover:border-white text-white hover:text-black rounded-sm font-display font-black italic uppercase text-sm tracking-widest transition-all transform -skew-x-12 cursor-pointer"
                    >
                      <div className="transform skew-x-12">
                        VIEW SHOWROOM
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/60 hover:bg-ktm-orange border border-zinc-800 hover:border-ktm-orange text-white rounded-full transition-all cursor-pointer"
          id="hero-btn-prev"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/60 hover:bg-ktm-orange border border-zinc-800 hover:border-ktm-orange text-white rounded-full transition-all cursor-pointer"
          id="hero-btn-next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-ktm-orange" : "w-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="showroom-categories">
        <div className="text-center space-y-2 mb-16 relative">
          <span className="text-stroke-white text-[6rem] sm:text-[9rem] leading-none absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none uppercase font-display font-black italic tracking-tighter opacity-15">
            STYLE
          </span>
          <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">DISCOVER YOUR STYLE</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter relative z-10 italic">
            BIKE <span className="text-ktm-orange">CATEGORIES</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-ktm-orange to-transparent mx-auto relative z-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="relative h-64 group rounded-sm overflow-hidden border-2 border-zinc-900 hover:border-ktm-orange transition-all duration-300 cursor-pointer text-left"
                id={`cat-card-${category.name.toLowerCase()}`}
              >
                {/* Background Image with Hover Zoom */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.bg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                {/* Info Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-ktm-orange text-white rounded-none transform -skew-x-12">
                      <div className="transform skew-x-12">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white bg-black border border-zinc-800 px-3 py-1 transform -skew-x-12">
                      <div className="transform skew-x-12">{category.count}</div>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic group-hover:text-ktm-orange transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-zinc-300 font-sans tracking-wide">
                      {category.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED KTM BIKES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="featured-bikes">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 relative">
          <div className="absolute -top-16 left-0 select-none pointer-events-none opacity-10">
            <span className="text-stroke-white text-[6rem] sm:text-[9rem] uppercase font-display font-black italic tracking-tighter">
              READY
            </span>
          </div>
          <div className="space-y-2 relative z-10 text-left">
            <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block">TOP PERFORMERS</span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter italic">
              FEATURED <span className="text-ktm-orange">BIKES</span>
            </h2>
            <div className="w-24 h-1.5 bg-ktm-orange" />
          </div>
          <button
            onClick={() => { setCategoryFilter(""); setCurrentView("bikes"); }}
            className="flex items-center gap-2 mt-6 md:mt-0 text-sm font-display font-black tracking-widest text-ktm-orange hover:text-white transition-colors uppercase cursor-pointer"
          >
            See All Models
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-[#0c0c0e] border-2 border-zinc-900 rounded-sm overflow-hidden hover:border-ktm-orange transition-all duration-300 flex flex-col text-left group"
              id={`featured-bike-${bike.id}`}
            >
              {/* Image Container with Badges */}
              <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                <img
                  src={bike.image}
                  alt={bike.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3.5 py-1 bg-ktm-orange text-white text-[10px] font-display font-black uppercase tracking-wider transform -skew-x-12">
                  <div className="transform skew-x-12">{bike.category}</div>
                </span>
                <span className="absolute bottom-4 right-4 bg-black text-ktm-orange font-mono font-bold text-sm px-3.5 py-1.5 border border-ktm-orange/30 transform -skew-x-12">
                  <div className="transform skew-x-12">${bike.price.toLocaleString()}</div>
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter italic group-hover:text-ktm-orange transition-colors">
                    {bike.name}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {bike.description}
                  </p>
                  
                  {/* Quick specs */}
                  <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-zinc-500 font-mono border-t border-zinc-900 mt-4">
                    <div>Engine: <span className="text-zinc-300 font-semibold">{bike.engineSize}</span></div>
                    <div>Power: <span className="text-zinc-300 font-semibold">{bike.power}</span></div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => {
                      onSelectBike(bike);
                      setCurrentView("bikes");
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-ktm-orange border-2 border-zinc-800 hover:border-ktm-orange text-white rounded-sm font-display font-black italic text-xs uppercase tracking-widest transition-all cursor-pointer transform -skew-x-12"
                  >
                    <div className="transform skew-x-12">
                      VIEW SPECS & BOOK
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MID BANNER */}
      <section className="relative h-80 bg-black border-y-2 border-zinc-900 overflow-hidden" id="race-banner">
        <div className="absolute inset-0 bg-grid-tech"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left relative">
            <div className="absolute -top-16 right-0 select-none pointer-events-none opacity-[0.04]">
              <span className="text-white text-[9rem] uppercase font-display font-black italic tracking-tighter">
                THRUST
              </span>
            </div>
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block">TEST RIDE EXPERIENCE</span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tighter italic leading-none">
                FEEL THE <span className="text-ktm-orange">ADRENALINE</span> BEFORE YOU BUY
              </h2>
              <p className="text-zinc-400 text-sm font-sans">
                Schedule a complimentary professional test ride at any of our primary dealers. Receive guidance from factory-certified KTM coaches.
              </p>
              <div>
                <button
                  onClick={() => {
                    if (bikes.length > 0) {
                      onSelectBike(bikes[0]);
                    }
                    setCurrentView("bikes");
                  }}
                  className="px-6 py-3.5 bg-ktm-orange hover:bg-white text-white hover:text-black rounded-sm font-display font-black italic uppercase text-xs tracking-wider transition-all transform -skew-x-12 cursor-pointer shadow-lg hover:shadow-white/10"
                >
                  <div className="transform skew-x-12">
                    BOOK TEST RIDE
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST BIKES IN SHOWROOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="latest-bikes">
        <div className="space-y-2 mb-16 text-center relative">
          <span className="text-stroke-white text-[6rem] sm:text-[9rem] leading-none absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none uppercase font-display font-black italic tracking-tighter opacity-15">
            ARRIVALS
          </span>
          <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">NEW RELEASES</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter relative z-10 italic">
            LATEST <span className="text-ktm-orange">ARRIVALS</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-ktm-orange to-transparent mx-auto relative z-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-[#0c0c0e] border-2 border-zinc-900 rounded-sm overflow-hidden hover:border-ktm-orange transition-all duration-300 flex flex-col text-left group"
              id={`latest-bike-${bike.id}`}
            >
              <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                <img
                  src={bike.image}
                  alt={bike.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-black text-zinc-300 text-[10px] font-mono font-bold uppercase rounded-none tracking-wider border border-zinc-850 transform -skew-x-12">
                  <div className="transform skew-x-12">NEW</div>
                </span>
                <span className="absolute bottom-4 right-4 bg-black text-white font-mono font-bold text-sm px-3.5 py-1.5 rounded-none border border-zinc-800 transform -skew-x-12">
                  <div className="transform skew-x-12">${bike.price.toLocaleString()}</div>
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-display font-black text-white group-hover:text-ktm-orange uppercase tracking-tighter italic transition-colors">
                    {bike.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-sans">
                    {bike.description}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">{bike.category}</span>
                  <button
                    onClick={() => {
                      onSelectBike(bike);
                      setCurrentView("bikes");
                    }}
                    className="text-xs font-display font-black italic text-ktm-orange group-hover:translate-x-1 transition-transform uppercase flex items-center gap-1 cursor-pointer"
                  >
                    DETAILS <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" id="customer-reviews">
        <div className="space-y-2 mb-16 text-center relative">
          <span className="text-stroke-white text-[6rem] sm:text-[9rem] leading-none absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none uppercase font-display font-black italic tracking-tighter opacity-15">
            FEEDBACK
          </span>
          <span className="text-ktm-orange text-xs font-display font-black tracking-[0.3em] uppercase block relative z-10">CUSTOMER CORNER</span>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tighter relative z-10 italic">
            REVIEWS & <span className="text-ktm-orange">FEEDBACK</span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-ktm-orange to-transparent mx-auto relative z-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#0b0b0d] border-2 border-zinc-900 p-8 rounded-sm text-left relative flex flex-col justify-between hover:border-ktm-orange transition-all duration-300"
              id={`review-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-ktm-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-ktm-orange text-ktm-orange" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  "{review.text}"
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-zinc-900 flex items-center gap-3">
                <div className="p-3 bg-zinc-900 rounded-none text-ktm-orange transform -skew-x-12 border border-zinc-800">
                  <div className="transform skew-x-12">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-display font-bold uppercase tracking-tight text-white text-base">{review.name}</h4>
                  <div className="flex gap-2 items-center text-[11px] text-zinc-500 font-mono mt-0.5">
                    <span>{review.date}</span>
                    <span>•</span>
                    <span className="text-ktm-orange font-semibold">{review.bike}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t-2 border-zinc-900 pt-16 pb-8" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <span className="text-4xl font-display font-black italic tracking-tighter text-white">
                K<span className="text-ktm-orange text-5xl">T</span>M
              </span>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                KTM Sportmotorcycle AG is an Austrian motorcycle and sports car manufacturer owned by Pierer Mobility AG and Bajaj Auto.
              </p>
              <p className="text-ktm-orange font-mono text-[10px] tracking-widest font-bold">
                READY TO RACE // EST. 1953
              </p>
            </div>

            {/* Column 2: Hours */}
            <div className="space-y-4">
              <h4 className="font-display font-black italic text-white text-base uppercase tracking-wider">DEALER HOURS</h4>
              <ul className="text-xs text-zinc-400 space-y-2 font-mono">
                <li>Monday - Friday: <span className="text-white">9:00 AM - 7:00 PM</span></li>
                <li>Saturday: <span className="text-white">10:00 AM - 5:00 PM</span></li>
                <li>Sunday: <span className="text-ktm-orange font-bold">Closed</span></li>
              </ul>
            </div>

            {/* Column 3: Links */}
            <div className="space-y-4">
              <h4 className="font-display font-black italic text-white text-base uppercase tracking-wider">QUICK NAVIGATION</h4>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li>
                  <button onClick={() => setCurrentView("bikes")} className="hover:text-ktm-orange transition-colors font-display font-bold uppercase tracking-wider cursor-pointer">
                    Explore Showroom
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("contact")} className="hover:text-ktm-orange transition-colors font-display font-bold uppercase tracking-wider cursor-pointer">
                    Dealership Locator
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView("home")} className="hover:text-ktm-orange transition-colors font-display font-bold uppercase tracking-wider cursor-pointer">
                    Home
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Address */}
            <div className="space-y-4">
              <h4 className="font-display font-black italic text-white text-base uppercase tracking-wider">GLOBAL HQ</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                100 KTM Orange Way<br />
                Mattighofen, Austria 5230
              </p>
              <div className="text-xs font-mono">
                Phone: <span className="text-white">+1 800-555-0199</span><br />
                Email: <span className="text-white">showroom@ktm.com</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-zinc-900 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-zinc-500 font-mono">
              © 2026 KTM Bike Showroom Management. All rights reserved.
            </p>
            <div className="flex gap-4 text-[11px] text-zinc-500 font-mono">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>|</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
