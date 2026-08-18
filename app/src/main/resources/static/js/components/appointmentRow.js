// appointmentRow.js
export function getAppointments(appointment) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
      <td class="patient-id">${appointment.patientName}</td>
      <td>${appointment.doctorName}</td>
      <td>${appointment.date}</td>
      <td>${appointment.time}</td>
      <td><img src="../assets/images/edit/edit.png" alt="action" class="prescription-btn" data-id="${appointment.id}" style="width: 24px; height: 24px; cursor: pointer;"></img></td>
    `;

  // Attach event listeners
  tr.querySelector(".prescription-btn").addEventListener("click", () => {
    window.location.href = `addPrescription.html?id=${patient.id}`;
  });

  return tr;
}
