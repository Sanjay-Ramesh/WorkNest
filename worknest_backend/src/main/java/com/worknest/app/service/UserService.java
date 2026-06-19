package com.worknest.app.service;

import com.worknest.app.dto.response.ProfileResponse;
import com.worknest.app.model.User;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ProfileResponse getProfile(String employeeId){
        User user = userRepository.findByEmployeeId(employeeId).orElseThrow(() ->
                new RuntimeException("Employee not found"));

        return new ProfileResponse(
                user.getEmployeeId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getJoinedDate(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
