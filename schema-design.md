## MySQL Database Design

### Table: admin
- `id`: INT, Primary Key, Auto Increment
- `username`: VARCHAR(50), Not Null, Unique
- `password`: VARCHAR(255), Not Null
- `email`: VARCHAR(100), Not Null, Unique
- `created_at`: DATETIME, Default CURRENT_TIMESTAMP

### Table: patients
- `id`: INT, Primary Key, Auto Increment
- `first_name`: VARCHAR(50), Not Null
- `last_name`: VARCHAR(50), Not Null
- `email`: VARCHAR(100), Not Null, Unique
- `phone`: VARCHAR(20), Not Null
- `date_of_birth`: DATE, Not Null
- `password`: VARCHAR(255), Not Null
- `created_at`: DATETIME, Default CURRENT_TIMESTAMP

### Table: doctors
- `id`: INT, Primary Key, Auto Increment
- `first_name`: VARCHAR(50), Not Null
- `last_name`: VARCHAR(50), Not Null
- `email`: VARCHAR(100), Not Null, Unique
- `phone`: VARCHAR(20), Not Null
- `specialty`: VARCHAR(100), Not Null
- `password`: VARCHAR(255), Not Null
- `is_active`: BOOLEAN, Default TRUE
*Note: Using a soft delete (`is_active`) so we don't accidentally orphan old appointments if a doctor leaves.*

### Table: appointments
- `id`: INT, Primary Key, Auto Increment
- `doctor_id`: INT, Foreign Key → doctors(id), On Delete CASCADE
- `patient_id`: INT, Foreign Key → patients(id), On Delete CASCADE
- `appointment_date`: DATE, Not Null
- `appointment_time`: TIME, Not Null
- `status`: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled), Default 0
- `reason_for_visit`: VARCHAR(255)
*Note: We split `appointment_date` and `appointment_time` to make querying for specific days easier, or we could just use DATETIME. Foreign keys use `CASCADE` so if a patient account is fully deleted, their appointments go with them.*

---

## MongoDB Collection Design

### Collection: prescriptions

```json
{
  "_id": "ObjectId('64abc123456')",
  "patientId": 105,
  "doctorId": 12,
  "appointmentId": 51,
  "diagnosis": "Seasonal Allergies",
  "medications": [
    {
      "name": "Cetirizine",
      "dosage": "10mg",
      "frequency": "Once daily",
      "duration": "14 days"
    },
    {
      "name": "Fluticasone nasal spray",
      "dosage": "50mcg",
      "frequency": "2 sprays per nostril daily",
      "duration": "As needed"
    }
  ],
  "doctorNotes": "Patient advised to avoid high pollen areas. Return if symptoms worsen after 1 week.",
  "issuedAt": "2026-08-17T10:30:00Z",
  "pharmacyDetails": {
    "name": "CVS Pharmacy",
    "location": "123 Main St",
    "contact": "555-0198"
  }
}
```
*Note: Storing medications as an array inside the prescription document avoids complex table joins that we would need in MySQL. Referencing `patientId` and `doctorId` rather than embedding the full user objects ensures our MongoDB documents don't go out of sync if the patient changes their name in MySQL.*
