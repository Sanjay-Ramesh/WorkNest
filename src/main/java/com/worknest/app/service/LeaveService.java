package com.worknest.app.service;

import com.worknest.app.dto.request.LeaveRequestDto;
import com.worknest.app.model.*;
import com.worknest.app.repository.LeaveBalanceRepository;
import com.worknest.app.repository.LeaveRequestRepository;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeaveService {
    private final UserRepository userRepository;

    private final LeaveRequestRepository leaveRequestRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    public String applyLeave(LeaveRequestDto leaveRequestDto){
        User user = userRepository.findByEmployeeId(leaveRequestDto.getEmployeeId()).orElseThrow(() ->
                new RuntimeException("Employee Id doesn't exists"));

        if(user.getRole() != Role.EMPLOYEE)
            throw new RuntimeException("Only Employees can apply");

        int currentYear = LocalDate.now().getYear();

        LeaveBalance leaveBalance = leaveBalanceRepository.findByEmployeeIdAndYear(leaveRequestDto.getEmployeeId(), currentYear).orElseThrow(() ->
                new RuntimeException("Leave Balance not found"));

        LeaveBalance.LeaveQuota quota = switch (leaveRequestDto.getLeaveType()) {
            case CASUAL -> leaveBalance.getCasual();
            case SICK -> leaveBalance.getSick();
            case EARNED -> leaveBalance.getEarned();
        };

        if(quota.getRemaining() <= 0)
            throw new RuntimeException("Insufficient Leave Balance");

        int totalDays = (int) ChronoUnit.DAYS.between(
                leaveRequestDto.getStartDate(),
                leaveRequestDto.getEndDate()
        ) + 1;

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employeeId(leaveRequestDto.getEmployeeId())
                .leaveType(leaveRequestDto.getLeaveType())
                .startDate(leaveRequestDto.getStartDate())
                .endDate(leaveRequestDto.getEndDate())
                .reason(leaveRequestDto.getReason())
                .totalDays(totalDays)
                .status(LeaveStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        leaveRequestRepository.save(leaveRequest);
        return "Leave Applied Successfully";
    }

    public String updateLeaveStatus(String leaveId,
                                    LeaveStatus leaveStatus,
                                    String managerId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId).orElseThrow(() ->
                new RuntimeException("Leave Request not found"));

        if(leaveRequest.getStatus() != LeaveStatus.PENDING){
            throw new RuntimeException("Leave already processed");
        }

        leaveRequest.setStatus(leaveStatus);
        leaveRequest.setReviewedBy(managerId);
        leaveRequest.setReviewedAt(LocalDateTime.now());

        if(leaveStatus == LeaveStatus.APPROVED){
            LeaveBalance leaveBalance =leaveBalanceRepository.findByEmployeeIdAndYear(leaveRequest.getEmployeeId(),
                    LocalDate.now().getYear()).orElseThrow(() ->
                    new RuntimeException("Leave Balance not found"));

            LeaveBalance.LeaveQuota quota = switch (leaveRequest.getLeaveType()){
                case CASUAL -> leaveBalance.getCasual();
                case SICK -> leaveBalance.getSick();
                case EARNED -> leaveBalance.getEarned();
            };

            quota.setUsed(quota.getUsed() + 1);
            quota.setRemaining(quota.getRemaining() - 1);

            leaveBalanceRepository.save(leaveBalance);
        }
        leaveRequestRepository.save(leaveRequest);
        return "Leave Status updated successfully";
    }

    public List<LeaveRequest> getAllLeaves(String employeeId, Role role){
        if(role == Role.HR_ADMIN)
            return leaveRequestRepository.findAll();
        else
            return leaveRequestRepository.findByEmployeeId(employeeId);
    }
}
