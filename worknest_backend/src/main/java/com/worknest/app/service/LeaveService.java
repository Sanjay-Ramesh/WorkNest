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
                new RuntimeException("Employee Id doesn't exist"));

        if (leaveRequestDto.getEndDate().isBefore(leaveRequestDto.getStartDate()))
            throw new RuntimeException("End date cannot be before start date");

        int currentYear = LocalDate.now().getYear();

        if (leaveRequestDto.getStartDate().getYear() != currentYear || leaveRequestDto.getEndDate().getYear() != currentYear)
            throw new RuntimeException("Apply Leave only for the current year");
        
        LeaveBalance leaveBalance = leaveBalanceRepository.findByEmployeeIdAndYear(leaveRequestDto.getEmployeeId(), currentYear).orElseThrow(() ->
                new RuntimeException("Leave Balance not found"));

        // Pick the correct quota bucket based on the requested leave type
        LeaveBalance.LeaveQuota quota = switch (leaveRequestDto.getLeaveType()) {
            case CASUAL -> leaveBalance.getCasual();
            case SICK -> leaveBalance.getSick();
            case EARNED -> leaveBalance.getEarned();
        };

        

        // +1 because ChronoUnit.DAYS.between is end-exclusive (e.g. Mon–Mon = 0 days without +1)
        int totalDays = (int) ChronoUnit.DAYS.between(
                leaveRequestDto.getStartDate(),
                leaveRequestDto.getEndDate()
        ) + 1;

        if (quota.getRemaining() < totalDays)
                throw new RuntimeException("Insufficient leave balance to apply this type of leave");

        // HR_ADMIN has no higher authority to approve their leave → auto-approve on submission.
        // MANAGER and EMPLOYEE leaves stay PENDING until a MANAGER/HR_ADMIN approves them.
        boolean autoApprove = (user.getRole() == Role.HR_ADMIN);
        LocalDateTime now = LocalDateTime.now();

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employeeId(leaveRequestDto.getEmployeeId())
                .department(user.getDepartment()) // always derived from user record — client value ignored
                .leaveType(leaveRequestDto.getLeaveType())
                .startDate(leaveRequestDto.getStartDate())
                .endDate(leaveRequestDto.getEndDate())
                .reason(leaveRequestDto.getReason())
                .totalDays(totalDays)
                .status(autoApprove ? LeaveStatus.APPROVED : LeaveStatus.PENDING)
                .reviewedBy(autoApprove ? user.getEmployeeId() : null)
                .reviewedAt(autoApprove ? now : null)
                .createdAt(now)
                .build();

        // Deduct balance immediately for auto-approved HR_ADMIN leaves
        if (autoApprove) {
            quota.setUsed(quota.getUsed() + totalDays);
            quota.setRemaining(quota.getRemaining() - totalDays);
            leaveBalanceRepository.save(leaveBalance);
        }

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

    // My Leaves always shows the logged-in user's own leave history, regardless of role.
    // Manager/HR Dashboard endpoints handle department-wide and org-wide views separately.
    public List<LeaveRequest> getAllLeaves(String employeeId){
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    // Returns PENDING leaves scoped to the caller's authority, excluding their own leaves.
    // HR_ADMIN/SUPER_ADMIN → all org pending; MANAGER → own department only.
    // Callers cannot approve their own leave requests.
    public List<LeaveRequest> getPendingLeavesForApproval(String callerEmail) {
        User caller = userRepository.findByEmail(callerEmail).orElseThrow(() ->
                new RuntimeException("Caller not found"));
        List<LeaveRequest> pending;
        if (caller.getRole() == Role.HR_ADMIN || caller.getRole() == Role.SUPER_ADMIN)
            pending = leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
        else
            pending = leaveRequestRepository.findByDepartmentAndStatus(caller.getDepartment(), LeaveStatus.PENDING);
        return pending.stream()
                .filter(leave -> !leave.getEmployeeId().equals(caller.getEmployeeId()))
                .collect(java.util.stream.Collectors.toList());
    }

    public LeaveBalance getLeaveBalance(String employeeId){
        int currentYear = LocalDate.now().getYear();
        LeaveBalance leaveBalance = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, currentYear).orElseThrow(() ->
                new RuntimeException("Leave Balance not found"));
        return leaveBalance;
    }
}
