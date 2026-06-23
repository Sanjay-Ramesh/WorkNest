package com.worknest.app.controller;

import com.worknest.app.dto.request.LeaveRequestDto;
import com.worknest.app.model.LeaveRequest;
import com.worknest.app.model.LeaveStatus;
import com.worknest.app.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<String> applyLeave(@Valid @RequestBody LeaveRequestDto leaveRequestDto){
        return new ResponseEntity<>(leaveService.applyLeave(leaveRequestDto), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('MANAGER', 'HR_ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateLeaveStatus(
            @PathVariable String id,
            @RequestParam LeaveStatus leaveStatus,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.updateLeaveStatus(id, leaveStatus, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves(@RequestParam String employeeId) {
        return ResponseEntity.ok(leaveService.getAllLeaves(employeeId));
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getLeaveBalance(@RequestParam String employeeId){
        return new ResponseEntity<>(leaveService.getLeaveBalance(employeeId), HttpStatus.OK);
    }
}
