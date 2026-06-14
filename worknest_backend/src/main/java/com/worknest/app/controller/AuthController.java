package com.worknest.app.controller;

import com.worknest.app.dto.request.LoginRequest;
import com.worknest.app.dto.request.RegisterRequest;
import com.worknest.app.dto.response.AuthResponse;
import com.worknest.app.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    // @Valid triggers Bean Validation — all @NotBlank / @Email annotations on the DTO are enforced here
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest){
        return new ResponseEntity<>(authService.register(registerRequest), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        return new ResponseEntity<AuthResponse>(authService.login(loginRequest), HttpStatus.OK);
    }

}
