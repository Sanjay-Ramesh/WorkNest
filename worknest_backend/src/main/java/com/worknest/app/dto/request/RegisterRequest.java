package com.worknest.app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
// @NotBlank = non-null AND non-empty string; @NotNull = non-null only (used for non-String types like Role, LocalDate)
public class RegisterRequest {
    @NotBlank
    private String employeeId;
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String department;
    @NotNull
    private LocalDate joinedDate;
}
