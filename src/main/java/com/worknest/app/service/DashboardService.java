package com.worknest.app.service;

import com.worknest.app.model.LeaveBalance;
import com.worknest.app.model.LeaveRequest;
import com.worknest.app.model.LeaveStatus;
import com.worknest.app.model.User;
import com.worknest.app.repository.LeaveBalanceRepository;
import com.worknest.app.repository.LeaveRequestRepository;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final UserRepository userRepository;

    // Returns all approved leaves where today falls within the leave date range.
    // Used by the dashboard to show who is currently absent.
    public List<LeaveRequest> getTodayOnLeave(){
        LocalDate today = LocalDate.now();
        return leaveRequestRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
                today, today, LeaveStatus.APPROVED);
    }

    // Fetches all leave requests still awaiting manager action.
    // Drives the pending approvals widget for HR/admin views.
    public List<LeaveRequest> getPendingLeaves() {
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    // Aggregates approved leave counts per department by joining leaves with user records.
    // Used to render the department-wise leave breakdown chart on the dashboard.
    public Map<String, Long> getLeavesByDepartment() {
        List<LeaveRequest> approvedLeaves = leaveRequestRepository.findByStatus(
                LeaveStatus.APPROVED);

        Map<String, Long> departmentCount = new HashMap<>();

        for(LeaveRequest leave : approvedLeaves){
            Optional<User> user = userRepository.findByEmployeeId(leave.getEmployeeId());

            if(user.isPresent()){
                String department = user.get().getDepartment();
                departmentCount.merge(department, 1L, Long::sum);
            }
        }
        return departmentCount;
    }

    // Computes average remaining balance across all employees for each leave type.
    // Used to show org-wide leave health at a glance without exposing individual records.
    public Map<String, Double> getLeaveBalanceSummary(){
        List<LeaveBalance> leaveBalance = leaveBalanceRepository.findAll();
        double avgCasual = leaveBalance.stream()
                .mapToDouble(b -> b.getCasual().getRemaining())
                .average()
                .orElse(0.0);

        double avgSick = leaveBalance.stream()
                .mapToDouble(b -> b.getSick().getRemaining())
                .average()
                .orElse(0.0);

        double avgEarned = leaveBalance.stream()
                .mapToDouble(b -> b.getEarned().getRemaining())
                .average()
                .orElse(0.0);

        return Map.of(
                "casual", avgCasual,
                "sick", avgSick,
                "earned", avgEarned
        );
    }
}
