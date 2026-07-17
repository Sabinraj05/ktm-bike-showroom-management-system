-- KTM Showroom Management System Database Schema
-- Database: ktm_showroom_db

CREATE DATABASE IF NOT EXISTS ktm_showroom_db;
USE ktm_showroom_db;

-- 1. Table: admin
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: bikes
CREATE TABLE IF NOT EXISTS bikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Naked', 'Supersport', 'Adventure', 'Motocross'
    engine_size VARCHAR(30) NOT NULL,
    power VARCHAR(30) NOT NULL,
    price DOUBLE NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    displacement VARCHAR(50),
    transmission VARCHAR(50),
    cooling VARCHAR(50),
    fuel_capacity VARCHAR(50),
    weight VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bike_id INT NOT NULL,
    type VARCHAR(30) NOT NULL, -- 'Purchase' or 'Test Ride'
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50), -- e.g., '10:00 AM - 11:30 AM'
    status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Completed', 'Cancelled'
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
);

-- 5. Table: test_ride (Alternate layout tracking, supports booking redundancy)
CREATE TABLE IF NOT EXISTS test_ride (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    bike_id INT NOT NULL,
    ride_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
);

-- 6. Table: contact
CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------- DATABASE SEEDING ----------------

-- Seed Admin
INSERT INTO admin (username, password, name, email) 
VALUES ('admin', 'admin123', 'KTM Admin Team', 'admin@ktm.com')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Users
INSERT INTO users (name, email, phone, password, role)
VALUES ('Alex Miller', 'alex@example.com', '+1 555-0144', 'password123', 'USER')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Bikes
INSERT INTO bikes (name, category, engine_size, power, price, image_url, description, displacement, transmission, cooling, fuel_capacity, weight)
VALUES 
('KTM 390 Duke', 'Naked', '373 cc', '44 HP', 5899.00, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', 'The Corner Rocket. Extremely lightweight, incredibly powerful, and packed with cutting-edge technology.', '373.2 cm³', '6-speed', 'Liquid cooled', '13.4 L', '149 kg'),
('KTM 1290 Super Duke R', 'Naked', '1301 cc', '180 HP', 19599.00, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', 'THE BEAST. Stripped back, laser-focused, and boasting mind-blowing power and agility.', '1301 cm³', '6-speed', 'Liquid cooled', '16 L', '189 kg'),
('KTM RC 390', 'Supersport', '373 cc', '44 HP', 5799.00, 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&w=800&q=80', 'Race-bred performance. High-performance supersport machine with pure Moto3 DNA for track and street.', '373 cm³', '6-speed with Quickshifter+', 'Liquid cooled', '13.7 L', '155 kg'),
('KTM 890 Adventure', 'Adventure', '889 cc', '105 HP', 13999.00, 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80', 'The Ultimate Escape. Master any terrain with unmatched agility, advanced electronics, and off-road capability.', '889 cm³', '6-speed', 'Liquid cooled with water/oil heat exchanger', '20 L', '196 kg'),
('KTM 250 Duke', 'Naked', '248 cc', '30 HP', 4599.00, 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80', 'The Thrill Chaser. Extremely responsive, agile streetfighter perfect for tearing up the urban concrete jungle.', '248.8 cm³', '6-speed', 'Liquid cooled', '13.4 L', '146 kg'),
('KTM 450 SX-F', 'Motocross', '450 cc', '63 HP', 10999.00, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', 'The Championship Weapon. A industry-leading motocross power-to-weight ratio to dominate any dirt track.', '449.9 cm³', '5-speed', 'Liquid cooled', '7.2 L', '102.6 kg')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Bookings
INSERT INTO bookings (user_id, bike_id, type, booking_date, time_slot, status, message)
VALUES (1, 1, 'Test Ride', '2026-07-25', '10:00 AM - 11:30 AM', 'Confirmed', 'Excited to test the corner rocket!')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Contacts
INSERT INTO contact (name, email, phone, subject, message)
VALUES ('Sabin Sharma', 'sabins9515@gmail.com', '+1 555-9000', 'Dealer Inquiry KTM 1290', 'Interested in the delivery times for the KTM 1290 Super Duke R in black.')
ON DUPLICATE KEY UPDATE id=id;
