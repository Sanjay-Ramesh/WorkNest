package com.worknest.app.controller;

import com.worknest.app.dto.response.ProfileResponse;
import com.worknest.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam String employeeId){
        return new ResponseEntity<>(userService.getProfile(employeeId), HttpStatus.OK);
    }
}
