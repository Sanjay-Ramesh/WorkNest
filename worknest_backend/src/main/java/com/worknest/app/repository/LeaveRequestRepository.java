package com.worknest.app.repository;

import com.worknest.app.model.LeaveRequest;
import com.worknest.app.model.LeaveStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {

    // Finds all leave requests submitted by a specific employee.
    // Used when an employee views their own leave history.
    List<LeaveRequest> findByEmployeeId(String employeeId);

    List<LeaveRequest> findByDepartment(String department);

    // Finds all leave requests matching a given status (PENDING, APPROVED, REJECTED).
    // Used by HR/Admin to fetch pending requests for review or audit.
    List<LeaveRequest> findByStatus(LeaveStatus leaveStatus);

    // Finds leave requests that overlap with the given date range and match the given status.
    // Used for conflict detection before approving a new leave request.
    List<LeaveRequest> findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus(
        LocalDate end, LocalDate start, LeaveStatus leaveStatus);
}
