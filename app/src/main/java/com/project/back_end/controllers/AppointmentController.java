package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

// 1. Set Up the Controller Class:
//    - Annotate the class with `@RestController` to define it as a REST API controller.
//    - Use `@RequestMapping("/appointments")` to set a base path for all appointment-related endpoints.
//    - This centralizes all routes that deal with booking, updating, retrieving, and canceling appointments.
@RestController
@RequestMapping("/appointments")
public class AppointmentController {

// 2. Autowire Dependencies:
//    - Inject `AppointmentService` for handling the business logic specific to appointments.
//    - Inject the general `Service` class, which provides shared functionality like token validation and appointment checks.
    private final AppointmentService appointmentService;
    private final Service service;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

// 3. Define the `getAppointments` Method:
//    - Handles HTTP GET requests to fetch appointments based on date and patient name.
//    - Takes the appointment date, patient name, and token as path variables.
//    - First validates the token for role `"doctor"` using the `Service`.
//    - If the token is valid, returns appointments for the given patient on the specified date.
//    - If the token is invalid or expired, responds with the appropriate message and status code.
    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable String date,
            @PathVariable String patientName,
            @PathVariable String token) {
        
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Unauthorized access");
            return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
        }
        
        Map<String, Object> result = appointmentService.getAppointment(patientName, LocalDate.parse(date), token);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

// 4. Define the `bookAppointment` Method:
//    - Handles HTTP POST requests to create a new appointment.
//    - Accepts a validated `Appointment` object in the request body and a token as a path variable.
//    - Validates the token for the `"patient"` role.
//    - Uses service logic to validate the appointment data (e.g., check for doctor availability and time conflicts).
//    - Returns success if booked, or appropriate error messages if the doctor ID is invalid or the slot is already taken.
    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @RequestBody Appointment appointment,
            @PathVariable String token) {
        
        Map<String, String> response = new HashMap<>();
        
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            response.put("error", "Unauthorized access");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        int isValid = service.validateAppointment(appointment);
        if (isValid == 1) {
            int result = appointmentService.bookAppointment(appointment);
            if (result == 1) {
                response.put("message", "Appointment booked successfully");
                return new ResponseEntity<>(response, HttpStatus.CREATED);
            } else {
                response.put("error", "Failed to book appointment");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else if (isValid == 0) {
            response.put("error", "Time slot unavailable");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.put("error", "Invalid doctor");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

// 5. Define the `updateAppointment` Method:
//    - Handles HTTP PUT requests to modify an existing appointment.
//    - Accepts a validated `Appointment` object and a token as input.
//    - Validates the token for `"patient"` role.
//    - Delegates the update logic to the `AppointmentService`.
//    - Returns an appropriate success or failure response based on the update result.
    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @RequestBody Appointment appointment,
            @PathVariable String token) {
        
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized access");
            return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
        }

        return appointmentService.updateAppointment(appointment);
    }

// 6. Define the `cancelAppointment` Method:
//    - Handles HTTP DELETE requests to cancel a specific appointment.
//    - Accepts the appointment ID and a token as path variables.
//    - Validates the token for `"patient"` role to ensure the user is authorized to cancel the appointment.
//    - Calls `AppointmentService` to handle the cancellation process and returns the result.
    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable long id,
            @PathVariable String token) {
        
        ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
        if (!tokenValidation.getStatusCode().is2xxSuccessful()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Unauthorized access");
            return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
        }

        return appointmentService.cancelAppointment(id, token);
    }

}
