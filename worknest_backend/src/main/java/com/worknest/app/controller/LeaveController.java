package com.worknest.app.controller;

import com.worknest.app.dto.request.LeaveRequestDto;
import com.worknest.app.model.LeaveRequest;
import com.worknest.app.model.LeaveStatus;
import com.worknest.app.model.Role;
import com.worknest.app.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<String> applyLeave(@RequestBody LeaveRequestDto leaveRequestDto){
        return new ResponseEntity<>(leaveService.applyLeave(leaveRequestDto), HttpStatus.OK);
    }

    // id comes from the URL path; leaveStatus and managerId come from query params
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateLeaveStatus(@PathVariable String id,
                                                    @RequestParam LeaveStatus leaveStatus,
                                                    @RequestParam String managerId){
        return new ResponseEntity<>(leaveService.updateLeaveStatus(id, leaveStatus, managerId), HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves(@RequestParam String employeeId, @RequestParam Role role){
        return new ResponseEntity<>(leaveService.getAllLeaves(employeeId, role), HttpStatus.OK);
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getLeaveBalance(@RequestParam String employeeId){
        return new ResponseEntity<>(leaveService.getLeaveBalance(employeeId), HttpStatus.OK);
    }
}
