function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // Check if on the homepage
    if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("index.html")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
    }

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // Invalid handle check
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    // Prepare Header Content
    let headerContent = `
        <header class="header">
            <img src="/assets/images/logo/logo.png" alt="Smart Clinic Logo" class="logo" onerror="this.src='../assets/images/logo/logo.png'">
            <div class="header-nav">
    `;

    if (role === "admin") {
        headerContent += `
            <button id="addDocBtn" class="adminBtn button">Add Doctor</button>
            <button id="logoutBtn" class="button">Logout</button>
        `;
    } else if (role === "doctor") {
        headerContent += `
            <button id="homeBtn" class="button">Home</button>
            <button id="logoutBtn" class="button">Logout</button>
        `;
    } else if (role === "patient") {
        headerContent += `
            <button id="loginBtn" class="button">Login</button>
            <button id="signupBtn" class="button">Sign Up</button>
        `;
    } else if (role === "loggedPatient") {
        headerContent += `
            <button id="homeBtn" class="button">Home</button>
            <button id="appointmentsBtn" class="button">Appointments</button>
            <button id="logoutPatientBtn" class="button">Logout</button>
        `;
    }

    headerContent += `
            </div>
        </header>
    `;

    // Inject the generated HTML into the placeholder
    headerDiv.innerHTML = headerContent;

    // Attach Event Listeners
    attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
    const addDocBtn = document.getElementById("addDocBtn");
    if (addDocBtn) {
        addDocBtn.addEventListener("click", () => {
            // Assume openModal is globally available from modals.js or util.js
            if (typeof openModal === "function") {
                openModal('addDoctor');
            } else {
                console.warn("openModal function is not available.");
            }
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

    const logoutPatientBtn = document.getElementById("logoutPatientBtn");
    if (logoutPatientBtn) {
        logoutPatientBtn.addEventListener("click", logoutPatient);
    }

    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            const role = localStorage.getItem("userRole");
            if (role === "doctor") {
                window.location.href = "/doctor/dashboard";
            } else if (role === "loggedPatient") {
                window.location.href = "/pages/patientDashboard.html";
            } else {
                window.location.href = "/";
            }
        });
    }

    const appointmentsBtn = document.getElementById("appointmentsBtn");
    if (appointmentsBtn) {
        appointmentsBtn.addEventListener("click", () => {
            window.location.href = "/pages/patientAppointments.html";
        });
    }

    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (typeof openModal === "function") openModal('login');
        });
    }

    const signupBtn = document.getElementById("signupBtn");
    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            if (typeof openModal === "function") openModal('signup');
        });
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
}

function logoutPatient() {
    localStorage.removeItem("token");
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
}

// Ensure the renderHeader function runs as soon as the DOM is parsed
document.addEventListener("DOMContentLoaded", renderHeader);
