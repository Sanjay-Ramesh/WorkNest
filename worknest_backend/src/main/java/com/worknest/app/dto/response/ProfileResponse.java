package com.worknest.app.dto.response;


import com.worknest.app.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private String employeeId;
    private String name;
    private String email;
    private Role role;
    private String department;
    private LocalDate joinedDate;
    private boolean isActive;
    private LocalDateTime createdAt;
}
