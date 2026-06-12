package com.worknest.app.repository;

import com.worknest.app.model.LeaveBalance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LeaveBalanceRepository extends MongoRepository<LeaveBalance, String> {
    // Compound query — Spring Data generates the MongoDB filter for both fields automatically
    Optional<LeaveBalance> findByEmployeeIdAndYear(String employeeId, int year);
}
