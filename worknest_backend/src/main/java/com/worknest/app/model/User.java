package com.worknest.app.model;

import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id; // MongoDB auto-generated ObjectId — not exposed to users
    private String employeeId; // human-readable HR identifier (e.g. "EMP001") used across the app
    private String name;
    @Email
    private String email;
    private String password;
    private Role role;
    private String department;
    private LocalDate joinedDate;
    private boolean isActive; // soft deactivation flag — account stays in DB but access is blocked
    private LocalDateTime createdAt;
}
