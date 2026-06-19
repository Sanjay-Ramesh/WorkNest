package com.worknest.app.service;

import com.worknest.app.model.User;
import com.worknest.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

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

        // Role loaded as a SimpleGrantedAuthority so @PreAuthorize("hasAuthority(...)") works.
        // We use the raw role name (e.g. "MANAGER") — hasAuthority() not hasRole() which needs "ROLE_" prefix.
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
    
}
