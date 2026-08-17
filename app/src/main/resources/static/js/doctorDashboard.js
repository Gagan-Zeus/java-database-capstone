/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/

import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

let patientTableBody;
let selectedDate = new Date().toISOString().split('T')[0];
let token = localStorage.getItem('token');
let patientName = "null";

document.addEventListener("DOMContentLoaded", () => {
    patientTableBody = document.getElementById("patientTableBody");

    // Call renderContent() (if it exists globally)
    if (typeof renderContent === "function") {
        renderContent();
    }

    const searchBar = document.getElementById("searchBar");
    const todayButton = document.getElementById("todayBtn") || document.getElementById("todayButton");
    const datePicker = document.getElementById("dateFilter") || document.getElementById("datePicker");

    // Set initial date picker UI
    if (datePicker) {
        datePicker.value = selectedDate;
    }

    // Search bar listener
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const val = e.target.value.trim();
            patientName = val !== "" ? val : "null";
            loadAppointments();
        });
    }

    // "Today" button listener
    if (todayButton) {
        todayButton.addEventListener("click", () => {
            selectedDate = new Date().toISOString().split('T')[0];
            if (datePicker) {
                datePicker.value = selectedDate;
            }
            loadAppointments();
        });
    }

    // Date picker listener
    if (datePicker) {
        datePicker.addEventListener("change", (e) => {
            selectedDate = e.target.value;
            loadAppointments();
        });
    }

    // Load today's appointments by default
    loadAppointments();
});

async function loadAppointments() {
    if (!patientTableBody) return;

    try {
        // Step 2: Clear table content
        patientTableBody.innerHTML = "";

        // Double check token in case login happened after script init
        if (!token) {
            token = localStorage.getItem('token');
        }

        // Step 1: Call API
        const appointments = await getAllAppointments(selectedDate, patientName, token);

        // Step 3: No appointments found
        if (!appointments || appointments.length === 0) {
            patientTableBody.innerHTML = `<tr><td colspan="5" class="noPatientRecord" style="text-align: center; padding: 2rem;">No Appointments found for today.</td></tr>`;
            return;
        }

        // Step 4: Construct objects and append rows
        appointments.forEach(appointment => {
            // Attempt to resolve nested patient data or flattened response fields
            const patientObj = {
                id: appointment.patient?.id || appointment.patientId || appointment.id || "N/A",
                name: appointment.patient?.name || appointment.patientName || appointment.name || "N/A",
                phone: appointment.patient?.phone || appointment.patientPhone || appointment.phone || "N/A",
                email: appointment.patient?.email || appointment.patientEmail || appointment.email || "N/A",
                appointmentId: appointment.id,
                status: appointment.status
            };

            const row = createPatientRow(patientObj);
            if (row) {
                patientTableBody.appendChild(row);
            }
        });

    } catch (error) {
        // Step 5: Catch block fallback
        console.error("Error loading appointments:", error);
        patientTableBody.innerHTML = `<tr><td colspan="5" class="noPatientRecord" style="text-align: center; padding: 2rem; color: #ef4444;">Error loading appointments. Try again later.</td></tr>`;
    }
}
