# Smart Clinic Management System Architecture

## Section 1: Architecture summary

The Smart Clinic Management System is a robust three-tier Spring Boot application designed to handle both server-rendered views and client-side API integrations. It employs Thymeleaf templates for rendering the Admin and Doctor dashboards, providing a traditional MVC experience for internal staff. Conversely, modules like Appointments, Patient Dashboard, and Patient Records are exposed via RESTful APIs, facilitating seamless integration with external clients such as mobile applications. 

Data persistence is strategically split across two databases to leverage their respective strengths. MySQL manages structured relational data—such as patient details, doctor profiles, appointments, and admin credentials—utilizing Spring Data JPA. Meanwhile, MongoDB handles unstructured and flexible document-based data, specifically prescriptions. Regardless of the entry point, all requests are routed through a unified Service Layer, which enforces business logic and orchestrates data access via the appropriate repository interfaces.

## Section 2: Numbered flow of data and control

1. **User Interaction**: Users access the application either through Thymeleaf-based web dashboards (Admin and Doctor) or via clients hitting REST API endpoints (Appointments, Patient Dashboard, Patient Records).
2. **Controller Routing**: The action is routed to the appropriate controller based on the request type. Server-side views are handled by Thymeleaf Controllers, whereas API requests are handled by REST Controllers.
3. **Service Layer Delegation**: The controllers delegate all processing to the central Service Layer, which executes business rules, performs validations, and coordinates complex workflows.
4. **Repository Abstraction**: The Service Layer calls the Repository Layer to access data. It interacts with MySQL Repositories for relational data and MongoDB Repositories for document data.
5. **Database Access**: The repositories interface directly with the physical databases. MySQL stores core structured entities, while MongoDB stores flexible structures like prescriptions.
6. **Model Binding**: Data fetched from the databases is mapped into Java objects. MySQL data becomes JPA Entities annotated with `@Entity`, and MongoDB data becomes Document objects annotated with `@Document`.
7. **Response Delivery**: The bound application models are finally returned to the response layer. For MVC flows, they populate Thymeleaf templates to render HTML; for REST flows, they are serialized into JSON and sent back to the client.
