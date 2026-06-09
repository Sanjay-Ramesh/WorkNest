# WorkNest Dev Log

## June 5, 2026

- Completed Phase 0 — Full system design
- Designed 3 MongoDB documents: User, LeaveRequest, LeaveBalance
- Mapped 6 MVP modules
- Designed full API endpoint plan
- Understood: soft delete, role-based filtering, DTOs, horizontal scaling
- Completed Phase 1 — Project setup
- Created package structure, pom.xml with all dependencies
- Set up application.properties and .gitignore

## June 5, 2026 — Update

- Fixed nested project structure issue
- Recreated 8 packages in correct location
- Fixed test package to com.worknest.app
- All files clean on GitHub

## June 6, 2026
- MongoDB Atlas cluster setup (worknest-cluster, AWS Mumbai)
- App connected to Atlas successfully
- Built Role.java — enum with 4 roles
- Built User.java — MongoDB document with 10 fields
- Built UserRepository.java — MongoRepository with findByEmail
- Switched from VS Code to IntelliJ for better Java support
- Understood: enum vs String, private encapsulation, lazy MongoDB connection, replica sets, Spring Data query derivation

## June 7, 2026
- Holiday Sunday

## June 8, 2026
- Started Phase 3 — Auth Module
- Built RegisterRequest.java — DTO with validation annotations
- Built LoginRequest.java — email + password with @NotBlank
- Built AuthResponse.java — response DTO with token field
- Built JwtUtil.java — generateToken, extractEmail, isTokenValid
- Built AuthService.java — register and login business logic
- Built AuthController.java — two POST endpoints /register and /login
- Switched from @Autowired to @RequiredArgsConstructor (constructor injection)
- Understood: BCrypt one-way hashing, JWT payload structure, Optional.orElseThrow, ResponseEntity, DRY principle

## June 9, 2026

- Built CustomUserDetailsService.java — bridges Spring Security + MongoDB
- Built JwtFilter.java — intercepts every request, validates JWT
- Built SecurityConfig.java — public vs protected endpoints, PasswordEncoder bean
- Fixed: WeakKeyException — jwt.secret was too short (< 256 bits)
- Fixed: 403 Forbidden — added SessionCreationPolicy.STATELESS
- Fixed: SSL/TLS error — added -Djdk.tls.client.protocols=TLSv1.2 JVM arg
- Fixed: MongoDB Network Access — added 0.0.0.0/0 for development

### First Postman Test — PASSED ✅
- POST /api/auth/register → 200 "User Registered Successfully"
- POST /api/auth/login → 200 JWT token returned
- User document verified in MongoDB Atlas — BCrypt password, all fields correct

### Concepts learned
- Authentication vs Authorization
- OncePerRequestFilter — runs exactly once per request
- SecurityContextHolder — stores authenticated user for request duration
- CSRF disabled for JWT REST APIs
- SessionCreationPolicy.STATELESS — JWT apps don't use sessions
- TLS 1.2 vs TLS 1.3 — Java 21 compatibility with MongoDB Atlas
- 0.0.0.0/0 vs specific IP — development vs production network access

## Tomorrow — Phase 5
- LeaveRequest model
- LeaveBalance model
- LeaveRepository
- LeaveService — apply, approve, reject
- LeaveController — role-based endpoints