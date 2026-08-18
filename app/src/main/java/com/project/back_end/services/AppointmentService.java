package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }

// 1. **Add @Service Annotation**:
//    - To indicate that this class is a service layer class for handling business logic.
//    - The `@Service` annotation should be added before the class declaration to mark it as a Spring service component.
//    - Instruction: Add `@Service` above the class definition.

// 2. **Constructor Injection for Dependencies**:
//    - The `AppointmentService` class requires several dependencies like `AppointmentRepository`, `Service`, `TokenService`, `PatientRepository`, and `DoctorRepository`.
//    - These dependencies should be injected through the constructor.
//    - Instruction: Ensure constructor injection is used for proper dependency management in Spring.

// 3. **Add @Transactional Annotation for Methods that Modify Database**:
//    - The methods that modify or update the database should be annotated with `@Transactional` to ensure atomicity and consistency of the operations.
//    - Instruction: Add the `@Transactional` annotation above methods that interact with the database, especially those modifying data.

// 4. **Book Appointment Method**:
//    - Responsible for saving the new appointment to the database.
//    - If the save operation fails, it returns `0`; otherwise, it returns `1`.
//    - Instruction: Ensure that the method handles any exceptions and returns an appropriate result code.
    @Transactional
    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

// 5. **Update Appointment Method**:
//    - This method is used to update an existing appointment based on its ID.
//    - It validates whether the patient ID matches, checks if the appointment is available for updating, and ensures that the doctor is available at the specified time.
//    - If the update is successful, it saves the appointment; otherwise, it returns an appropriate error message.
//    - Instruction: Ensure proper validation and error handling is included for appointment updates.
    @Transactional
    public ResponseEntity<Map<String, String>> updateAppointment(Appointment appointment) {
        Map<String, String> response = new HashMap<>();
        try {
            Optional<Appointment> existing = appointmentRepository.findById(appointment.getId());
            if (existing.isPresent()) {
                appointmentRepository.save(appointment);
                response.put("message", "Appointment updated successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("error", "Appointment not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("error", "Failed to update appointment");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

// 6. **Cancel Appointment Method**:
//    - This method cancels an appointment by deleting it from the database.
//    - It ensures the patient who owns the appointment is trying to cancel it and handles possible errors.
//    - Instruction: Make sure that the method checks for the patient ID match before deleting the appointment.
    @Transactional
    public ResponseEntity<Map<String, String>> cancelAppointment(long id, String token) {
        Map<String, String> response = new HashMap<>();
        try {
            Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
            if (appointmentOptional.isPresent()) {
                Appointment appointment = appointmentOptional.get();
                appointmentRepository.delete(appointment);
                response.put("message", "Appointment cancelled");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("error", "Appointment not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("error", "Failed to cancel appointment");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

// 7. **Get Appointments Method**:
//    - This method retrieves a list of appointments for a specific doctor on a particular day, optionally filtered by the patient's name.
//    - It uses `@Transactional` to ensure that database operations are consistent and handled in a single transaction.
//    - Instruction: Ensure the correct use of transaction boundaries, especially when querying the database for appointments.
    @Transactional(readOnly = true)
    public Map<String, Object> getAppointment(String pname, LocalDate date, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = tokenService.extractEmail(token);
            Doctor doctor = doctorRepository.findByEmail(email);
            if (doctor == null) {
                response.put("error", "Doctor not found");
                return response;
            }
            
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            
            List<Appointment> appointments;
            if (pname != null && !pname.equalsIgnoreCase("null") && !pname.isEmpty()) {
                appointments = appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(doctor.getId(), pname, start, end);
            } else {
                appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctor.getId(), start, end);
            }
            
            List<AppointmentDTO> dtos = appointments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

            response.put("appointments", dtos);
        } catch (Exception e) {
            System.err.println("Error fetching doctor appointments: " + e.getMessage());
            response.put("error", "Failed to fetch appointments");
            response.put("appointments", new ArrayList<>());
        }
        return response;
    }

    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
            appointment.getId(),
            appointment.getDoctor() != null ? appointment.getDoctor().getId() : null,
            appointment.getDoctor() != null ? appointment.getDoctor().getName() : null,
            appointment.getPatient() != null ? appointment.getPatient().getId() : null,
            appointment.getPatient() != null ? appointment.getPatient().getName() : null,
            appointment.getPatient() != null ? appointment.getPatient().getEmail() : null,
            appointment.getPatient() != null ? appointment.getPatient().getPhone() : null,
            appointment.getPatient() != null ? appointment.getPatient().getAddress() : null,
            appointment.getAppointmentTime(),
            appointment.getStatus()
        );
    }

// 8. **Change Status Method**:
//    - This method updates the status of an appointment by changing its value in the database.
//    - It should be annotated with `@Transactional` to ensure the operation is executed in a single transaction.
//    - Instruction: Add `@Transactional` before this method to ensure atomicity when updating appointment status.
    @Transactional
    public void changeStatus(int status, long id) {
        appointmentRepository.updateStatus(status, id);
    }

}
