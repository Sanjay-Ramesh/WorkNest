package com.worknest.app.repository;

import com.worknest.app.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    // Spring Data derives these queries from method names — no manual query or @Query needed
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
}
