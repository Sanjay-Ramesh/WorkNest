package com.worknest.app.util;

import com.worknest.app.model.Role;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET;
    @Value("${jwt.expiration}")
    private long expiration;
    private SecretKey secretKey;

    // @PostConstruct runs after @Value injection completes — SecretKey can't be built at field declaration time
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email, String name, String employeeId, Role role){
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role.name())
                .claim("name", name)
                .claim("employeeId", employeeId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+ expiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // jjwt throws JwtException on expired or malformed tokens — catch is the intended validation pattern
    public boolean isTokenValid(String token){
        try{
            extractEmail(token);
            return true;
        }
        catch(JwtException e){
            return false;
        }
    }
}
