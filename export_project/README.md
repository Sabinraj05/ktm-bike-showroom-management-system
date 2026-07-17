# KTM Bike Showroom Management System

A professional, full-featured management system for KTM Dealerships, styled with the iconic KTM Orange, Black, and White theme.

---

## 🛠 Technology Stack

### Frontend
- **HTML5** & **CSS3** (Outfit and JetBrains Mono Typography, Modern responsive grids)
- **Vanilla JavaScript** (Session sync, fetch controllers, dynamic cards compiling)

### Backend
- **Java Spring Boot 3.2.3**
- **Spring MVC** (REST APIs)
- **Spring Data JPA** (Object Relational Mapping)

### Database
- **MySQL 8.x**

---

## 📁 Project Structure

```
export_project/
├── database/
│   └── schema.sql                # MySQL Tables, Constraints, and Seeding Records
├── backend/
│   ├── pom.xml                   # Maven Build Configuration
│   └── src/
│       └── main/
│           ├── java/com/ktm/showroom/
│           │   ├── ShowroomApplication.java     # Boot Entrypoint
│           │   ├── model/                      # JPA Entities (User, Bike, Booking, Contact)
│           │   ├── repository/                 # Spring Data repositories
│           │   └── controller/                 # REST Controllers (Auth, Bike, Booking, Contact)
│           └── resources/
│               └── application.properties       # Port, MySQL Source, JPA settings
└── frontend/
    ├── css/style.css             # Polished KTM CSS styles
    ├── js/main.js                # REST API Connectors and UI compilation
    ├── index.html                # Home Screen (Hero, Featured Bikes, Slider)
    ├── bikes.html                # KTM Garage listing, category filter, detailed modal
    ├── bookings.html             # Secure Booking scheduler & Test Ride scheduler
    ├── user.html                 # Rider Sign-in, registration ID, & Rider Profile Dashboard
    ├── contact.html              # Location tracker, Dealer Coordinates, contact forms
    └── admin.html                # Admin Control Panel (Inventory CRUD, stats counters)
```

---

## 🚀 Setup & Execution Instructions

### 1. Database Provisioning
1. Start your local **MySQL Server**.
2. Open your terminal or MySQL Workbench, and run the schema file located at:
   `database/schema.sql`
   *This creates the database `ktm_showroom_db` and seeds default data including the administrator account and premium bike entries.*

### 2. Spring Boot Backend Execution
1. Open the `/backend` directory in your IDE (**Visual Studio Code** or IntelliJ IDEA).
2. Ensure you have the **Java Extension Pack** installed in VS Code.
3. Open `src/main/resources/application.properties` and verify/adjust the MySQL username and password to match your setup:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root123
   ```
4. Run the application from VS Code:
   - Run the main method in `ShowroomApplication.java`
   - Alternatively, execute using terminal in the `backend/` folder:
     ```bash
     mvn spring-boot:run
     ```
   *The server starts listening on `http://localhost:8080`.*

### 3. Frontend Execution
1. Simply open `/frontend/index.html` in your browser.
2. For the best development experience, right-click `index.html` in VS Code and select **Open with Live Server**.
3. All requests automatically target the API running at `http://localhost:8080`.

---

## 🔐 Credentials

- **Rider Account**:
  - Email: `alex@example.com`
  - Password: `password123`
- **Administrator Cockpit**:
  - Username: `admin`
  - Password: `admin123`
  *(Sign in under `user.html` to auto-redirect to the Admin Dashboard).*
