import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Mock Database State
interface Bike {
  id: string;
  name: string;
  category: string; // "Naked", "Supersport", "Adventure", "Motocross"
  engineSize: string;
  power: string;
  price: number;
  image: string;
  description: string;
  specs: {
    displacement: string;
    transmission: string;
    cooling: string;
    fuelCapacity: string;
    weight: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bikeId: string;
  bikeName: string;
  type: "Purchase" | "Test Ride";
  date: string;
  timeSlot?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  message?: string;
  createdAt: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

// Initial Data Seeds
let bikes: Bike[] = [
  {
    id: "bike-1",
    name: "KTM 390 Duke",
    category: "Naked",
    engineSize: "373 cc",
    power: "44 HP",
    price: 5899,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    description: "The Corner Rocket. Extremely lightweight, incredibly powerful, and packed with cutting-edge technology.",
    specs: {
      displacement: "373.2 cm³",
      transmission: "6-speed",
      cooling: "Liquid cooled",
      fuelCapacity: "13.4 L",
      weight: "149 kg (dry)"
    }
  },
  {
    id: "bike-2",
    name: "KTM 1290 Super Duke R",
    category: "Naked",
    engineSize: "1301 cc",
    power: "180 HP",
    price: 19599,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    description: "THE BEAST. Stripped back, laser-focused, and boasting mind-blowing power and agility.",
    specs: {
      displacement: "1301 cm³",
      transmission: "6-speed",
      cooling: "Liquid cooled",
      fuelCapacity: "16 L",
      weight: "189 kg (dry)"
    }
  },
  {
    id: "bike-3",
    name: "KTM RC 390",
    category: "Supersport",
    engineSize: "373 cc",
    power: "44 HP",
    price: 5799,
    image: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80",
    description: "Race-bred performance. High-performance supersport machine with pure Moto3 DNA for track and street.",
    specs: {
      displacement: "373 cm³",
      transmission: "6-speed with Quickshifter+",
      cooling: "Liquid cooled",
      fuelCapacity: "13.7 L",
      weight: "155 kg (dry)"
    }
  },
  {
    id: "bike-4",
    name: "KTM 890 Adventure",
    category: "Adventure",
    engineSize: "889 cc",
    power: "105 HP",
    price: 13999,
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80",
    description: "The Ultimate Escape. Master any terrain with unmatched agility, advanced electronics, and off-road capability.",
    specs: {
      displacement: "889 cm³",
      transmission: "6-speed",
      cooling: "Liquid cooled with water/oil heat exchanger",
      fuelCapacity: "20 L",
      weight: "196 kg (dry)"
    }
  },
  {
    id: "bike-5",
    name: "KTM 250 Duke",
    category: "Naked",
    engineSize: "248 cc",
    power: "30 HP",
    price: 4599,
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80",
    description: "The Thrill Chaser. Extremely responsive, agile streetfighter perfect for tearing up the urban concrete jungle.",
    specs: {
      displacement: "248.8 cm³",
      transmission: "6-speed",
      cooling: "Liquid cooled",
      fuelCapacity: "13.4 L",
      weight: "146 kg (dry)"
    }
  },
  {
    id: "bike-6",
    name: "KTM 450 SX-F",
    category: "Motocross",
    engineSize: "450 cc",
    power: "63 HP",
    price: 10999,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    description: "The Championship Weapon. A industry-leading motocross power-to-weight ratio to dominate any dirt track.",
    specs: {
      displacement: "449.9 cm³",
      transmission: "5-speed",
      cooling: "Liquid cooled",
      fuelCapacity: "7.2 L",
      weight: "102.6 kg (dry)"
    }
  }
];

let users: User[] = [
  {
    id: "user-admin",
    name: "KTM Admin Team",
    email: "admin@ktm.com",
    phone: "+1 800-555-0199",
    role: "ADMIN",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "user-1",
    name: "Alex Miller",
    email: "alex@example.com",
    phone: "+1 555-0144",
    role: "USER",
    createdAt: "2026-03-10T14:32:00.000Z"
  }
];

// Mock user passwords mapping (for simple demo auth)
let userPasswords: Record<string, string> = {
  "admin@ktm.com": "admin123",
  "alex@example.com": "password123"
};

let bookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    userName: "Alex Miller",
    userEmail: "alex@example.com",
    userPhone: "+1 555-0144",
    bikeId: "bike-1",
    bikeName: "KTM 390 Duke",
    type: "Test Ride",
    date: "2026-07-25",
    timeSlot: "10:00 AM - 11:30 AM",
    status: "Confirmed",
    message: "Excited to test the corner rocket!",
    createdAt: "2026-07-15T09:00:00.000Z"
  }
];

let contacts: ContactInquiry[] = [
  {
    id: "contact-1",
    name: "Sabin Sharma",
    email: "sabins9515@gmail.com",
    phone: "+1 555-9000",
    subject: "Dealer Inquiry KTM 1290",
    message: "Interested in the delivery times for the KTM 1290 Super Duke R in black.",
    createdAt: "2026-07-16T15:20:00.000Z"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // ---------------- REST APIs ----------------

  // auth endpoints
  app.post("/api/register", (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser: User = {
      id: "user-" + (users.length + 1),
      name,
      email,
      phone,
      role: "USER",
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    userPasswords[email.toLowerCase()] = password;

    res.status(201).json({ user: newUser });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const emailLower = email.toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === emailLower);
    
    if (!user || userPasswords[emailLower] !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ user });
  });

  // bikes endpoints
  app.get("/api/bikes", (req, res) => {
    res.json(bikes);
  });

  app.post("/api/bikes", (req, res) => {
    const { name, category, engineSize, power, price, image, description, specs } = req.body;
    if (!name || !category || !price || !image) {
      return res.status(400).json({ error: "Missing essential bike fields" });
    }

    const newBike: Bike = {
      id: "bike-" + (bikes.length + 1),
      name,
      category,
      engineSize: engineSize || "N/A",
      power: power || "N/A",
      price: Number(price),
      image,
      description: description || "",
      specs: specs || {
        displacement: engineSize || "N/A",
        transmission: "6-speed",
        cooling: "Liquid cooled",
        fuelCapacity: "14 L",
        weight: "150 kg"
      }
    };

    bikes.push(newBike);
    res.status(201).json(newBike);
  });

  app.put("/api/bikes/:id", (req, res) => {
    const { id } = req.params;
    const bikeIndex = bikes.findIndex((b) => b.id === id);
    if (bikeIndex === -1) {
      return res.status(404).json({ error: "Bike not found" });
    }

    const updatedBike = {
      ...bikes[bikeIndex],
      ...req.body,
      id // preserve id
    };

    bikes[bikeIndex] = updatedBike;
    res.json(updatedBike);
  });

  app.delete("/api/bikes/:id", (req, res) => {
    const { id } = req.params;
    bikes = bikes.filter((b) => b.id !== id);
    res.json({ success: true });
  });

  // bookings endpoints
  app.get("/api/bookings", (req, res) => {
    const { email } = req.query;
    if (email) {
      // Filter for specific user
      const filtered = bookings.filter(
        (b) => b.userEmail.toLowerCase() === (email as string).toLowerCase()
      );
      return res.json(filtered);
    }
    // Return all for admin
    res.json(bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const { userId, userName, userEmail, userPhone, bikeId, bikeName, type, date, timeSlot, message } = req.body;
    if (!userEmail || !bikeId || !bikeName || !type || !date) {
      return res.status(400).json({ error: "Missing booking credentials" });
    }

    const newBooking: Booking = {
      id: "booking-" + (bookings.length + 1),
      userId: userId || "guest",
      userName: userName || "Guest Rider",
      userEmail,
      userPhone: userPhone || "",
      bikeId,
      bikeName,
      type,
      date,
      timeSlot,
      status: "Pending",
      message: message || "",
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.put("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const bookingIndex = bookings.findIndex((b) => b.id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    bookings[bookingIndex].status = status || bookings[bookingIndex].status;
    res.json(bookings[bookingIndex]);
  });

  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    bookings = bookings.filter((b) => b.id !== id);
    res.json({ success: true });
  });

  // users list endpoints (Admin)
  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter((u) => u.id !== id);
    res.json({ success: true });
  });

  // contacts endpoints
  app.get("/api/contact", (req, res) => {
    res.json(contacts);
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required form fields" });
    }

    const newContact: ContactInquiry = {
      id: "contact-" + (contacts.length + 1),
      name,
      email,
      phone: phone || "",
      subject,
      message,
      createdAt: new Date().toISOString()
    };

    contacts.push(newContact);
    res.status(201).json(newContact);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KTM Showroom Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
