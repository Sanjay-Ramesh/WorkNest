package com.worknest.app.service;

import com.worknest.app.dto.request.LoginRequest;
import com.worknest.app.dto.request.RegisterRequest;
import com.worknest.app.dto.response.AuthResponse;
import com.worknest.app.model.User;
import com.worknest.app.repository.UserRepository;
import com.worknest.app.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository ;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    public String register(RegisterRequest registerRequest){
        // Reject duplicate emails before any DB write
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .employeeId(registerRequest.getEmployeeId())
                .role(registerRequest.getRole())
                .department(registerRequest.getDepartment())
                .joinedDate(registerRequest.getJoinedDate())
                .isActive(true) // accounts are active on creation; admins can deactivate later
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public AuthResponse login(LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() ->
                new RuntimeException("Email doesn't exists"));

        // matches() hashes the raw input and compares it to the stored BCrypt hash — not a plain string check
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Password doesn't match");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return new AuthResponse(token);
    }
}
