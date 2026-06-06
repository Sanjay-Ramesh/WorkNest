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
    private String id;
    private String employeeId;
    private String name;
    @Email
    private String email;
    private String password;
    private Role role;
    private String department;
    private LocalDate joinedDate;
    private boolean isActive;
    private LocalDateTime createdAt;
}
