package com.worknest.app.service;

import com.worknest.app.model.User;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
// Spring Security calls this during the filter chain — JwtFilter triggers it to verify the token's email
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    // Spring Security's method name says "username" but in this app the username is the email address
    @Override
    public UserDetails loadUserByUsername(String username){
        User user = userRepository.findByEmail(username).orElseThrow(() ->
                new UsernameNotFoundException("Email doesn't exists"));

        // Empty authorities here — role-based access is enforced via @PreAuthorize using JWT claims
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
    
}
