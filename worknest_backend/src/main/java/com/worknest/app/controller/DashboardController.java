package com.worknest.app.controller;

import com.worknest.app.model.LeaveRequest;
import com.worknest.app.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    // GET /api/dashboard/todayleave — employees on approved leave today.
    @GetMapping("/todayleave")
    public ResponseEntity<List<LeaveRequest>> getTodayOnLeave(){
        return new ResponseEntity<>(dashboardService.getTodayOnLeave(), HttpStatus.OK);
    }

    // GET /api/dashboard/pendingleaves — all leaves awaiting approval, for HR/admin action.
    @GetMapping("/pendingleaves")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
        return new ResponseEntity<>(dashboardService.getPendingLeaves(), HttpStatus.OK);
    }

    // GET /api/dashboard/department — approved leave count grouped by department.
    @GetMapping("/department")
    public ResponseEntity<Map<String, Long>> getLeavesByDepartment() {
        return new ResponseEntity<>(dashboardService.getLeavesByDepartment(), HttpStatus.OK);
    }

    // GET /api/dashboard/summary — average remaining leave balances across all employees.
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Double>> getLeaveBalanceSummary() {
        return new ResponseEntity<>(dashboardService.getLeaveBalanceSummary(), HttpStatus.OK);
    }

}
