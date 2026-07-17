// KTM Showroom Management System - Frontend Core Javascript
const API_BASE = "/api"; // Works relatively. For local VS Code setup, you can set it to http://localhost:8080/api

// Helper: Save and Get Active Session User
function getSessionUser() {
    const saved = localStorage.getItem("ktm_user");
    return saved ? JSON.parse(saved) : null;
}

function setSessionUser(user) {
    if (user) {
        localStorage.setItem("ktm_user", JSON.stringify(user));
    } else {
        localStorage.removeItem("ktm_user");
    }
}

// Global UI Init
document.addEventListener("DOMContentLoaded", () => {
    updateNavbarUI();
});

// Update Navbar based on Auth State
function updateNavbarUI() {
    const user = getSessionUser();
    const navBtnContainer = document.getElementById("nav-auth-container");
    if (!navBtnContainer) return;

    if (user) {
        navBtnContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 13px; font-weight: 700; color: #fff;">
                    RIDER: <span style="color: #FF6600;">${user.name.toUpperCase()}</span>
                </span>
                ${user.role === 'ADMIN' ? '<a href="admin.html" class="nav-btn" style="background-color: #333;">Admin Cockpit</a>' : '<a href="user.html" class="nav-btn" style="background-color: #333;">My Profile</a>'}
                <button onclick="handleLogout()" class="nav-btn" style="background-color: transparent; border: 1px solid #333; color: #fff;">Logout</button>
            </div>
        `;
    } else {
        navBtnContainer.innerHTML = `
            <a href="user.html" class="nav-btn">Rider Sign In</a>
        `;
    }
}

function handleLogout() {
    setSessionUser(null);
    window.location.href = "index.html";
}

// 1. HOME VIEW: Load Featured and Latest Bikes
async function initHomePage() {
    const featuredContainer = document.getElementById("featured-bikes-container");
    if (!featuredContainer) return;

    try {
        const res = await fetch(`${API_BASE}/bikes`);
        if (!res.ok) throw new Error("Database offline");
        const bikes = await res.json();

        // Featured (first 3)
        featuredContainer.innerHTML = bikes.slice(0, 3).map(bike => renderBikeCard(bike)).join('');
    } catch (err) {
        featuredContainer.innerHTML = `<p style="color: #666; font-family: monospace;">Showroom database synch offline. Ensure Spring Boot is running on port 8080.</p>`;
    }
}

// 2. BIKE LIST VIEW: Load and Filter Bikes
let globalBikes = [];
async function initBikesPage() {
    const gridContainer = document.getElementById("all-bikes-container");
    if (!gridContainer) return;

    try {
        const res = await fetch(`${API_BASE}/bikes`);
        globalBikes = await res.json();
        renderFilteredBikes();
    } catch (err) {
        gridContainer.innerHTML = `<p style="color: #666;">Failed to load KTM stock registers. Please start Spring Boot server.</p>`;
    }
}

function renderFilteredBikes(filterCategory = "All", searchQuery = "") {
    const gridContainer = document.getElementById("all-bikes-container");
    if (!gridContainer) return;

    const filtered = globalBikes.filter(bike => {
        const matchesCat = filterCategory === "All" || bike.category.toLowerCase() === filterCategory.toLowerCase();
        const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              bike.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (filtered.length > 0) {
        gridContainer.innerHTML = filtered.map(bike => renderBikeCard(bike)).join('');
    } else {
        gridContainer.innerHTML = `<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: #555;">NO KTM MODELS DETECTED</div>`;
    }
}

// Common Bike Card HTML Generator
function renderBikeCard(bike) {
    return `
        <div class="bike-card">
            <div class="bike-img-container">
                <img src="${bike.imageUrl || bike.image}" alt="${bike.name}" class="bike-img" referrerPolicy="no-referrer" />
                <span class="bike-category-badge">${bike.category}</span>
                <span class="bike-price-badge">$${Number(bike.price).toLocaleString()}</span>
            </div>
            <div class="bike-details">
                <div>
                    <h3 class="bike-details-title">${bike.name}</h3>
                    <p class="bike-desc">${bike.description}</p>
                    <div class="bike-specs-preview">
                        <div>Engine: <span>${bike.engineSize}</span></div>
                        <div>Power: <span>${bike.power}</span></div>
                    </div>
                </div>
                <button onclick="viewBikeDetails(${JSON.stringify(bike).replace(/"/g, '&quot;')})" class="bike-btn">TECHNICAL DETAILS</button>
            </div>
        </div>
    `;
}

// Show Detail Overlay/Modal
function viewBikeDetails(bike) {
    let detailModal = document.getElementById("detail-modal");
    if (!detailModal) {
        detailModal = document.createElement("div");
        detailModal.id = "detail-modal";
        detailModal.className = "modal-overlay";
        document.body.appendChild(detailModal);
    }

    detailModal.innerHTML = `
        <div class="modal-card" style="max-width: 800px; text-align: left;">
            <div class="modal-header">
                <h3 class="modal-title">${bike.name} Specs</h3>
                <button class="modal-close" onclick="closeModal('detail-modal')">X</button>
            </div>
            <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <img src="${bike.imageUrl || bike.image}" style="width:100%; border-radius:12px; height: 200px; object-fit: cover;" referrerPolicy="no-referrer" />
                    <p style="font-size: 13px; color: #888; margin-top: 15px;">${bike.description}</p>
                </div>
                <div>
                    <h4 style="color: #FF6600; text-transform: uppercase; font-size: 12px; margin-bottom: 10px; font-family: monospace;">Technical Parameters</h4>
                    <table style="width:100%; font-size: 11px; font-family: monospace; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Category:</td><td style="text-align: right; color:#fff;">${bike.category}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Engine:</td><td style="text-align: right; color:#fff;">${bike.engineSize}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Power:</td><td style="text-align: right; color:#fff;">${bike.power}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Displacement:</td><td style="text-align: right; color:#fff;">${bike.displacement || bike.engineSize}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Transmission:</td><td style="text-align: right; color:#fff;">${bike.transmission || '6-speed'}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Cooling:</td><td style="text-align: right; color:#fff;">${bike.cooling || 'Liquid cooled'}</td></tr>
                        <tr style="border-bottom: 1px solid #222;"><td style="padding: 8px 0; color: #555;">Fuel Tank:</td><td style="text-align: right; color:#fff;">${bike.fuelCapacity || '14 L'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #555;">Dry Weight:</td><td style="text-align: right; color:#fff;">${bike.weight || '150 kg'}</td></tr>
                    </table>
                    <div style="margin-top: 25px; display: flex; gap: 10px;">
                        <button onclick="triggerBooking('Test Ride', ${bike.id}, '${bike.name}')" class="nav-btn" style="flex:1; font-size:11px; text-align:center;">Test Ride</button>
                        <button onclick="triggerBooking('Purchase', ${bike.id}, '${bike.name}')" class="nav-btn" style="flex:1; background-color:#fff; color:#000; font-size:11px; text-align:center;">Buy Reserve</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    detailModal.style.display = "flex";
}

function triggerBooking(type, bikeId, bikeName) {
    const user = getSessionUser();
    if (!user) {
        alert("Authentication required. Redirecting to rider sign in.");
        window.location.href = "user.html";
        return;
    }
    closeModal("detail-modal");
    
    // Redirect or trigger a scheduling modal. Since we have a standalone bookings scheduler in bookings.html, let's redirect.
    localStorage.setItem("ktm_pending_booking", JSON.stringify({ type, bikeId, bikeName }));
    window.location.href = "bookings.html";
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

// 3. BOOKINGS MODULE: Handle reservation creation
async function initBookingsPage() {
    const user = getSessionUser();
    if (!user) {
        document.getElementById("bookings-auth-box").style.display = "block";
        document.getElementById("bookings-scheduler-box").style.display = "none";
        return;
    }

    document.getElementById("bookings-auth-box").style.display = "none";
    document.getElementById("bookings-scheduler-box").style.display = "block";

    // Auto-fill form fields
    document.getElementById("book-rider-name").value = user.name;
    document.getElementById("book-rider-email").value = user.email;

    // Check if redirect from details exists
    const pending = localStorage.getItem("ktm_pending_booking");
    if (pending) {
        const { type, bikeId, bikeName } = JSON.parse(pending);
        document.getElementById("book-bike-id").value = bikeId;
        document.getElementById("book-bike-name").value = bikeName;
        document.getElementById("book-type-select").value = type;
        localStorage.removeItem("ktm_pending_booking");
    } else {
        // Fetch bikes list to populate dropdown
        try {
            const res = await fetch(`${API_BASE}/bikes`);
            const bikes = await res.json();
            const select = document.getElementById("book-bike-id");
            select.innerHTML = bikes.map(b => `<option value="${b.id}">${b.name} ($${b.price.toLocaleString()})</option>`).join('');
        } catch (err) {}
    }

    // Load active rider reservations
    loadRiderReservations();
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    const user = getSessionUser();
    if (!user) return;

    const bikeId = document.getElementById("book-bike-id").value;
    const selectElem = document.getElementById("book-bike-id");
    const bikeName = selectElem.options[selectElem.selectedIndex].text.split(" (")[0];
    const type = document.getElementById("book-type-select").value;
    const date = document.getElementById("book-date-input").value;
    const message = document.getElementById("book-notes-input").value;

    const payload = {
        user: { id: user.id },
        bike: { id: bikeId },
        type,
        bookingDate: date,
        timeSlot: type === "Test Ride" ? "10:00 AM - 11:30 AM" : null,
        status: "Pending",
        message
    };

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Reservation placed successfully! Ready to race!");
            loadRiderReservations();
            document.getElementById("book-notes-input").value = "";
        } else {
            alert("Database write error.");
        }
    } catch (err) {
        alert("Database connection offline.");
    }
}

async function loadRiderReservations() {
    const container = document.getElementById("active-reservations-container");
    if (!container) return;

    const user = getSessionUser();
    try {
        const res = await fetch(`${API_BASE}/bookings?email=${user.email}`);
        const bookings = await res.json();

        if (bookings.length > 0) {
            container.innerHTML = bookings.map(b => `
                <div style="background-color: #121212; border: 1px solid #1c1c1c; padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <span style="font-size: 10px; font-weight: 800; background-color: #FF6600; color: #fff; padding: 2px 6px; text-transform: uppercase; border-radius: 3px;">${b.type}</span>
                        <h4 style="margin: 8px 0 4px; font-size: 16px; font-weight: 800; text-transform: uppercase; color: #fff;">${b.bike ? b.bike.name : b.bikeName}</h4>
                        <p style="font-size: 12px; color: #666; font-family: monospace;">DATE: ${b.bookingDate || b.date}</p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; border: 1px solid #333; padding: 4px 10px; border-radius: 20px; color: #ff6600;">${b.status}</span>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `<p style="color: #444; font-size: 13px;">No active purchase reserves or test rides logged.</p>`;
        }
    } catch (err) {
        container.innerHTML = `<p style="color: #444;">Spring Boot backend synch offline.</p>`;
    }
}

// 4. AUTH PAGE: Handle Register / Login
async function handleUserAuth(event, isLogin) {
    event.preventDefault();
    const email = document.getElementById(isLogin ? "login-email" : "reg-email").value;
    const password = document.getElementById(isLogin ? "login-pass" : "reg-pass").value;

    let payload = { email, password };
    let endpoint = "/api/login";

    if (!isLogin) {
        payload.name = document.getElementById("reg-name").value;
        payload.phone = document.getElementById("reg-phone").value;
        endpoint = "/api/register";
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            setSessionUser(data.user);
            alert(`Rider authenticated. Welcome ${data.user.name}!`);
            window.location.href = data.user.role === "ADMIN" ? "admin.html" : "index.html";
        } else {
            alert(data.error || "Authentication failed.");
        }
    } catch (err) {
        alert("Spring Boot connection offline.");
    }
}

// 5. CONTACT SUBMISSION
async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("con-name").value;
    const email = document.getElementById("con-email").value;
    const phone = document.getElementById("con-phone").value;
    const subject = document.getElementById("con-subject").value;
    const message = document.getElementById("con-msg").value;

    const payload = { name, email, phone, subject, message };

    try {
        const res = await fetch(`${API_BASE}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Dealership inquiry transmitted. Ready to race!");
            document.getElementById("contact-feedback-form").reset();
        } else {
            alert("Database write failed.");
        }
    } catch (err) {
        alert("Spring Boot backend offline.");
    }
}
