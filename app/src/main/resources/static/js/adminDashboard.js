/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/

import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load the initial doctor list
    await loadDoctorCards();

    // 2. Attach click listener to "Add Doctor" button
    // Fallback using event delegation since header.js dynamically injects this button
    document.body.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'addDocBtn') {
            openModal('addDoctor');
        }
    });

    // 3. Search and filter event listeners
    const searchBar = document.getElementById("searchBar");
    const filterTime = document.getElementById("sortByTime");
    const filterSpecialty = document.getElementById("filterBySpecialty");

    if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
    if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
    if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);
});

async function loadDoctorCards() {
    try {
        const contentDiv = document.getElementById("content");
        if (!contentDiv) return;
        contentDiv.innerHTML = "";
        
        const doctors = await getDoctors();
        if (doctors && doctors.length > 0) {
            renderDoctorCards(doctors);
        } else {
            contentDiv.innerHTML = "<p class='noPatientRecord'>No doctors found.</p>";
        }
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

async function filterDoctorsOnChange() {
    try {
        const searchBar = document.getElementById("searchBar");
        const filterTime = document.getElementById("sortByTime");
        const filterSpecialty = document.getElementById("filterBySpecialty");
        
        const name = searchBar && searchBar.value.trim() !== "" ? searchBar.value.trim() : null;
        const time = filterTime && filterTime.value !== "" ? filterTime.value : null;
        const specialty = filterSpecialty && filterSpecialty.value !== "" ? filterSpecialty.value : null;

        const filteredDoctors = await filterDoctors(name, time, specialty);
        const contentDiv = document.getElementById("content");
        
        if (!contentDiv) return;
        contentDiv.innerHTML = "";

        if (filteredDoctors && filteredDoctors.length > 0) {
            renderDoctorCards(filteredDoctors);
        } else {
            contentDiv.innerHTML = "<p class='noPatientRecord'>No doctors found with the given filters.</p>";
        }
    } catch (error) {
        console.error("Error filtering doctors:", error);
        alert("Failed to filter doctors.");
    }
}

function renderDoctorCards(doctors) {
    const contentDiv = document.getElementById("content");
    if (!contentDiv) return;
    contentDiv.innerHTML = "";
    
    doctors.forEach(doctor => {
        const card = createDoctorCard(doctor);
        contentDiv.appendChild(card);
    });
}

window.adminAddDoctor = async function(event) {
    if (event) event.preventDefault();

    // Collect data
    const nameInput = document.getElementById('doctorName');
    const specialtyInput = document.getElementById('doctorSpecialty');
    const emailInput = document.getElementById('doctorEmail');
    const passwordInput = document.getElementById('doctorPassword');
    const phoneInput = document.getElementById('doctorPhone');

    // Make sure elements exist before accessing .value
    if (!nameInput || !specialtyInput || !emailInput || !passwordInput || !phoneInput) {
        console.error("One or more modal inputs missing.");
        return;
    }
    
    const name = nameInput.value;
    const specialty = specialtyInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const phone = phoneInput.value;
    
    // Collect checkboxes
    const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
    const availableTimes = Array.from(availabilityCheckboxes).map(cb => cb.value);

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Authentication failed. Please login as admin again.");
        return;
    }

    const newDoctor = {
        name,
        specialty,
        email,
        password,
        phone,
        availableTimes
    };

    try {
        const result = await saveDoctor(newDoctor, token);
        if (result && result.success) {
            alert(result.message || "Doctor added successfully!");
            
            // Attempt to gracefully close the modal
            const modal = document.getElementById('modal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
            
            // Reload the list cleanly without full page refresh
            await loadDoctorCards();
            
            // Optional: reset the form
            const addForm = document.getElementById('addDoctorForm');
            if (addForm) addForm.reset();
        } else {
            alert(result.message || "Failed to add doctor.");
        }
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("An error occurred while adding the doctor.");
    }
};
