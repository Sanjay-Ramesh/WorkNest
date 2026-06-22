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

@Service
@RequiredArgsConstructor
public class LeaveService {
    private final UserRepository userRepository;

    private final LeaveRequestRepository leaveRequestRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    private final EmailService emailService;

    public String applyLeave(LeaveRequestDto leaveRequestDto){
        User user = userRepository.findByEmployeeId(leaveRequestDto.getEmployeeId()).orElseThrow(() ->
                new RuntimeException("Employee Id doesn't exists"));

        // Managers and HR_ADMIN are not allowed to submit leave requests
        if(user.getRole() != Role.EMPLOYEE)
            throw new RuntimeException("Only Employees can apply");

        if (leaveRequestDto.getEndDate().isBefore(leaveRequestDto.getStartDate()))
            throw new RuntimeException("End date cannot be before start date");

        int currentYear = LocalDate.now().getYear();

        LeaveBalance leaveBalance = leaveBalanceRepository.findByEmployeeIdAndYear(leaveRequestDto.getEmployeeId(), currentYear).orElseThrow(() ->
                new RuntimeException("Leave Balance not found"));

        // Pick the correct quota bucket based on the requested leave type
        LeaveBalance.LeaveQuota quota = switch (leaveRequestDto.getLeaveType()) {
            case CASUAL -> leaveBalance.getCasual();
            case SICK -> leaveBalance.getSick();
            case EARNED -> leaveBalance.getEarned();
        };

        if(quota.getRemaining() <= 0)
            throw new RuntimeException("Insufficient Leave Balance");

        // +1 because ChronoUnit.DAYS.between is end-exclusive (e.g. Mon–Mon = 0 days without +1)
        int totalDays = (int) ChronoUnit.DAYS.between(
                leaveRequestDto.getStartDate(),
                leaveRequestDto.getEndDate()
        ) + 1;

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employeeId(leaveRequestDto.getEmployeeId())
                .department(leaveRequestDto.getDapartment())
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

    // Approves or rejects a PENDING leave request, deducts balance on approval, and emails the employee.
    // callerEmail comes from the verified JWT — not from the HTTP request — so it can't be spoofed.
    public String updateLeaveStatus(String leaveId,
                                    LeaveStatus leaveStatus,
                                    String callerEmail) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId).orElseThrow(() ->
                new RuntimeException("Leave Request not found"));

        // Guard against re-processing — an APPROVED or REJECTED leave cannot be changed again
        if(leaveRequest.getStatus() != LeaveStatus.PENDING){
            throw new RuntimeException("Leave already processed");
        }

        User manager = userRepository.findByEmail(callerEmail).orElseThrow(() ->
                new RuntimeException("Manager not found"));

        leaveRequest.setStatus(leaveStatus);
        leaveRequest.setReviewedBy(manager.getEmployeeId());
        leaveRequest.setReviewedAt(LocalDateTime.now());

        // Deduct from balance only on APPROVED — REJECTED leaves do not consume quota
        if(leaveStatus == LeaveStatus.APPROVED){
            LeaveBalance leaveBalance =leaveBalanceRepository.findByEmployeeIdAndYear(leaveRequest.getEmployeeId(),
                    LocalDate.now().getYear()).orElseThrow(() ->
                    new RuntimeException("Leave Balance not found"));

            LeaveBalance.LeaveQuota quota = switch (leaveRequest.getLeaveType()){
                case CASUAL -> leaveBalance.getCasual();
                case SICK -> leaveBalance.getSick();
                case EARNED -> leaveBalance.getEarned();
            };

            if (quota.getRemaining() < leaveRequest.getTotalDays())
                throw new RuntimeException("Insufficient leave balance to approve this request");

            quota.setUsed(quota.getUsed() + leaveRequest.getTotalDays());
            quota.setRemaining(quota.getRemaining() - leaveRequest.getTotalDays());

            leaveBalanceRepository.save(leaveBalance);
        }
        leaveRequestRepository.save(leaveRequest);

        User employee = userRepository.findByEmployeeId(leaveRequest.getEmployeeId()).orElseThrow(
                () -> new RuntimeException("Employee not found"));

        emailService.sendLeaveStatusEmail(
                employee.getEmail(),
                employee.getName(),
                leaveRequest.getStatus()
        );

        return "Leave Status updated successfully";
    }

    // HR_ADMIN and MANAGER see all requests across the org; employees see only their own.
    // callerEmail comes from the verified JWT — not from the HTTP request — so it can't be spoofed.
    public List<LeaveRequest> getAllLeaves(String employeeId, String callerEmail){
        User caller = userRepository.findByEmail(callerEmail).orElseThrow(() ->
                new RuntimeException("Caller not found"));
        if(caller.getRole() == Role.HR_ADMIN)
            return leaveRequestRepository.findAll();
        else if(caller.getRole() == Role.MANAGER)
            return leaveRequestRepository.findByDepartment(caller.getDepartment()); // only manager's department
        else
            return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public LeaveBalance getLeaveBalance(String employeeId){
        int currentYear = LocalDate.now().getYear();
        LeaveBalance leaveBalance = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, currentYear).orElseThrow(() ->
                new RuntimeException("Leave Balance not found"));
        return leaveBalance;
    }
}
