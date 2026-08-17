import { deleteDoctor } from '../services/doctorServices.js';
import { getPatientData } from '../services/patientServices.js';
// We assume showBookingOverlay is exported from modals.js or similar
import { showBookingOverlay } from './modals.js';

export function createDoctorCard(doctor) {
    const card = document.createElement("div");
    card.classList.add("doctor-card");

    const role = localStorage.getItem("userRole");

    // Doctor Info Section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");

    const name = document.createElement("h3");
    name.textContent = doctor.name;

    const specialization = document.createElement("p");
    specialization.textContent = "Specialty: " + doctor.specialty;

    const email = document.createElement("p");
    email.textContent = "Email: " + doctor.email;

    const availability = document.createElement("p");
    const times = doctor.availableTimes ? doctor.availableTimes.join(", ") : "N/A";
    availability.textContent = "Available: " + times;

    infoDiv.appendChild(name);
    infoDiv.appendChild(specialization);
    infoDiv.appendChild(email);
    infoDiv.appendChild(availability);

    // Actions Section
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");

    // Admin Role
    if (role === "admin") {
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("adminBtn");
        removeBtn.textContent = "Delete";
        
        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
            if (confirmed) {
                const token = localStorage.getItem("token");
                try {
                    await deleteDoctor(doctor.id, token);
                    card.remove();
                } catch (error) {
                    console.error("Error deleting doctor:", error);
                    alert("Failed to delete doctor. Please try again.");
                }
            }
        });
        
        actionsDiv.appendChild(removeBtn);
    } 
    // Patient (Not Logged In)
    else if (role === "patient" || !role) {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("button");
        bookNow.addEventListener("click", () => {
            alert("Patient needs to login first.");
        });
        
        actionsDiv.appendChild(bookNow);
    } 
    // Logged In Patient
    else if (role === "loggedPatient") {
        const bookNow = document.createElement("button");
        bookNow.textContent = "Book Now";
        bookNow.classList.add("button");
        bookNow.addEventListener("click", async (e) => {
            const token = localStorage.getItem("token");
            try {
                const patientData = await getPatientData(token);
                // Dynamically load/trigger the overlay
                if (typeof showBookingOverlay === "function") {
                    showBookingOverlay(e, doctor, patientData);
                } else {
                    console.error("showBookingOverlay is not defined.");
                }
            } catch (error) {
                console.error("Error fetching patient data for booking:", error);
                alert("Failed to retrieve your account details. Please log in again.");
            }
        });
        
        actionsDiv.appendChild(bookNow);
    }

    // Final Assembly
    card.appendChild(infoDiv);
    if (actionsDiv.children.length > 0) {
        card.appendChild(actionsDiv);
    }

    return card;
}
