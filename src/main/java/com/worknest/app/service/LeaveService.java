package com.worknest.app.service;

import com.worknest.app.dto.request.LeaveRequestDto;
import com.worknest.app.model.LeaveRequest;
import com.worknest.app.model.LeaveStatus;
import com.worknest.app.model.Role;
import com.worknest.app.repository.LeaveBalanceRepository;
import com.worknest.app.repository.LeaveRequestRepository;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {
    private final UserRepository userRepository;

    private final LeaveRequestRepository leaveRequestRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    public String applyLeave(LeaveRequestDto leaveRequestDto){

    }

    public String updateLeaveStatus(String leaveId,
                                    LeaveStatus leaveStatus,
                                    String managerId) {


    }

    public List<LeaveRequest> getAllLeaves(String employeeId, Role role){

    }
}
