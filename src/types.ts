export interface Bike {
  id: string;
  name: string;
  category: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface Booking {
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

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
