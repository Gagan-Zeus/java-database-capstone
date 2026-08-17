# User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]

---

## Admin User Stories

**Title:** Admin Secure Login
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. Given valid credentials, the admin is successfully logged in and redirected to the admin dashboard.
2. Given invalid credentials, an appropriate error message is displayed to the user.
3. Access to admin-only pages remains restricted for non-authenticated users.

**Priority:** High
**Story Points:** 3
**Notes:**
- Passwords must be securely hashed in the database.

---

**Title:** Admin Secure Logout
_As an admin, I want to log out of the portal, so that I can protect system access when I am done._

**Acceptance Criteria:**
1. An admin can click a "Logout" button from any admin page.
2. Upon logout, the admin's session is fully terminated.
3. The admin is redirected to the public login screen.

**Priority:** High
**Story Points:** 1
**Notes:**
- Ensure session cookies are properly invalidated upon logout.

---

**Title:** Add Doctor Profile
_As an admin, I want to add doctors to the portal, so that the clinic staff directory is updated._

**Acceptance Criteria:**
1. The admin can access an "Add Doctor" form containing relevant fields (name, specialty, contact info).
2. The system validates all required fields before allowing submission.
3. Upon successful creation, the new doctor appears in the active directory and is saved to the database.

**Priority:** High
**Story Points:** 3
**Notes:**
- Consider validating that the doctor's email is unique.

---

**Title:** Delete Doctor Profile
_As an admin, I want to delete a doctor's profile from the portal, so that former staff are no longer listed._

**Acceptance Criteria:**
1. The admin can select a specific doctor and choose a "Delete" action.
2. The system prompts the admin for confirmation before proceeding with the deletion.
3. The doctor is removed from the directory upon confirmation.

**Priority:** Medium
**Story Points:** 2
**Notes:**
- Since doctors might have past appointments, consider implementing a "soft delete" (marking as inactive) instead of a hard delete from the database.

---

**Title:** Track Monthly Appointments via Stored Procedure
_As an admin, I want to run a stored procedure in the MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. A stored procedure exists in the MySQL database that calculates and groups appointments by month.
2. The admin can execute the stored procedure directly via the MySQL CLI interface.
3. The query output accurately reflects the total count of appointments for each corresponding month.

**Priority:** Low
**Story Points:** 3
**Notes:**
- This is a direct database action. The database admin user must have execute privileges for this specific procedure.

---

## Patient User Stories

**Title:** Browse Doctors (Guest)
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. A public "Doctors" page is accessible to unauthenticated users.
2. The page displays a list of doctors along with their specialties.
3. Users can navigate or scroll to see the complete list of available doctors.

**Priority:** Medium
**Story Points:** 2
**Notes:**
- Restrict viewing detailed schedules and booking functionality to authenticated users only.

---

**Title:** Patient Signup
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. A registration form is available that accepts name, email, and password.
2. The system validates that the email is not already associated with an existing account.
3. Upon successful registration, the patient's account is created in the database.

**Priority:** High
**Story Points:** 3
**Notes:**
- Ensure passwords meet minimum security complexity requirements before acceptance.

---

**Title:** Patient Login
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. The patient can enter their registered email and password on the login page.
2. Valid credentials authenticate the user and grant access to the patient dashboard.
3. Invalid credentials display an appropriate error message and prevent access.

**Priority:** High
**Story Points:** 2
**Notes:**
- Ensure authentication logic cleanly separates patient roles from admin or doctor roles.

---

**Title:** Patient Logout
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. A "Logout" button is visible in the patient navigation menu.
2. Clicking the logout button terminates the session completely.
3. Attempting to access private patient pages after logging out redirects to the login screen.

**Priority:** High
**Story Points:** 1
**Notes:**
- Clear any local storage or cookies associated with the patient session.

---

**Title:** Book Appointment
_As a patient, I want to log in and book an hour-long appointment to consult with a doctor, so that I can receive medical care._

**Acceptance Criteria:**
1. The authenticated patient can select a doctor and view their available hour-long time slots.
2. The patient can select a specific slot, confirm the details, and submit the booking.
3. The system confirms the booking, saves it to the database, and marks the slot as unavailable.

**Priority:** High
**Story Points:** 5
**Notes:**
- Implement robust concurrency checks to prevent double-booking if two patients try to book the exact same slot simultaneously.

---

**Title:** View Upcoming Appointments
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. The patient dashboard displays a dedicated section for future appointments.
2. Each appointment entry details the date, time, and the assigned doctor's name.
3. The list is sorted chronologically, showing the soonest appointments first.

**Priority:** High
**Story Points:** 2
**Notes:**
- Ensure past appointments are filtered out or shown in a separate "History" tab.

---

## Doctor User Stories

**Title:** Doctor Login
_As a doctor, I want to log into the portal to manage my appointments, so that I can securely access my schedule._

**Acceptance Criteria:**
1. A login page accepts the doctor's email and password.
2. Valid credentials authenticate the user and redirect to the doctor dashboard.
3. Invalid credentials display an appropriate error message.

**Priority:** High
**Story Points:** 2
**Notes:**
- Differentiate doctor role access from patient and admin portals.

---

**Title:** Doctor Logout
_As a doctor, I want to log out of the portal to protect my data, so that my account remains secure on shared devices._

**Acceptance Criteria:**
1. A "Logout" option is clearly visible in the doctor dashboard.
2. Clicking logout terminates the doctor's session completely.
3. The user is immediately redirected to the public login page.

**Priority:** High
**Story Points:** 1
**Notes:**
- Clear session cache to prevent unauthorized access via the browser's "back" button.

---

**Title:** View Appointment Calendar
_As a doctor, I want to view my appointment calendar to stay organized, so that I know my daily schedule._

**Acceptance Criteria:**
1. The dashboard displays a calendar or chronological list of all upcoming appointments.
2. Each entry indicates the specific time slot and the patient's name.
3. The doctor can filter or navigate between different days and weeks.

**Priority:** High
**Story Points:** 3
**Notes:**
- Highlight today's appointments clearly.

---

**Title:** Manage Availability
_As a doctor, I want to mark my unavailability to inform patients only the available slots, so that I don't get booked when I am off-duty._

**Acceptance Criteria:**
1. The doctor can select specific time slots or full days and mark them as "unavailable."
2. Marked slots are immediately removed from the public patient booking view.
3. The doctor can easily toggle unavailable slots back to "available."

**Priority:** High
**Story Points:** 4
**Notes:**
- Address edge cases if a patient attempts to book exactly as the doctor marks a slot unavailable.

---

**Title:** Update Profile Information
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. The doctor can access a "Profile Settings" page.
2. The doctor can edit fields such as specialization, phone number, and bio.
3. Saved changes are immediately reflected on the public-facing "Doctors" list.

**Priority:** Medium
**Story Points:** 2
**Notes:**
- Consider requiring admin approval for name changes.

---

**Title:** View Patient Details
_As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared for the consultation._

**Acceptance Criteria:**
1. Clicking on a specific appointment reveals patient details (name, contact info, reason for visit).
2. The doctor can view any attached medical history or past notes relevant to the patient.
3. Access is strictly limited so the doctor only sees details for their assigned patients.

**Priority:** High
**Story Points:** 3
**Notes:**
- Maintain strict data privacy protocols (e.g., HIPAA compliance) for patient records.
