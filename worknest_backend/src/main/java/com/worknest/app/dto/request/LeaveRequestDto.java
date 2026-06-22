package com.worknest.app.dto.request;

import com.worknest.app.model.LeaveType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
// totalDays is intentionally absent — calculated server-side in LeaveService to prevent client tampering
public class LeaveRequestDto {
    @NotBlank
    private String employeeId;
    @NotBlank
    private String dapartment;
    @NotNull
    private LeaveType leaveType;
    @NotNull
    @FutureOrPresent
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    @NotBlank
    private String reason;
}
