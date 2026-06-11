package com.worknest.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
// Only the JWT token is returned — no user info in the response to avoid leaking sensitive data
public class AuthResponse {
    private String token;
}
