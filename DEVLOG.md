# WorkNest Dev Log

## June 5, 2026

### Phase 0 — System Design Complete
- Designed 3 MongoDB documents: User, LeaveRequest, LeaveBalance
- Mapped 6 MVP modules
- Designed full API endpoint plan
- Understood: soft delete, role-based filtering, DTOs, horizontal scaling

### Phase 1 — Project Setup Complete
- Created Spring Boot project with all dependencies
- Created 8 package structure
- Set up application.properties and .gitignore
- Created CLAUDE.md, DEVLOG.md, README.md
- Fixed nested project structure issue
- First GitHub push — WorkNest repo live

## June 6, 2026

### Phase 2 — Models + Atlas Complete
- MongoDB Atlas cluster setup (worknest-cluster, AWS Mumbai)
- App connected to Atlas successfully
- Built Role.java — enum with 4 roles
- Built User.java — MongoDB document with 10 fields
- Built UserRepository.java — MongoRepository with findByEmail
- Switched from VS Code to IntelliJ IDEA Community Edition

**Concepts learned:**
- Enum vs String — compile time safety
- Private encapsulation — @Data generates getters/setters
- Lazy MongoDB connection
- Replica sets — 3 servers, automatic failover
- Spring Data query derivation — findByEmail auto-generates query

## June 7, 2026
- Holiday

## June 8, 2026

### Phase 3 — Auth Module Complete

**Files built:**
- RegisterRequest.java — DTO with validation annotations
- LoginRequest.java — email + password with @NotBlank
- AuthResponse.java — response DTO with token field
- JwtUtil.java — generateToken, extractEmail, isTokenValid
- AuthService.java — register and login business logic
- AuthController.java — POST /api/auth/register, POST /api/auth/login

**Concepts learned:**
- BCrypt one-way hashing — never decrypted, only compared
- JWT payload structure — email, role, issuedAt, expiration
- Optional.orElseThrow — one DB call vs two
- ResponseEntity — wraps response with HTTP status
- @Valid — triggers DTO validation before method runs
- Constructor injection (@RequiredArgsConstructor) vs @Autowired
- jjwt 0.11.x vs 0.12.3 API changes

## June 9, 2026

### Phase 4 — Security Complete

**Files built:**
- CustomUserDetailsService.java — bridges Spring Security + MongoDB
- JwtFilter.java — intercepts every request, validates JWT
- SecurityConfig.java — public vs protected endpoints, PasswordEncoder bean

**Bugs fixed:**
- WeakKeyException — jwt.secret was too short (< 256 bits)
- 403 Forbidden — added SessionCreationPolicy.STATELESS
- SSL/TLS error — added -Djdk.tls.client.protocols=TLSv1.2 JVM arg
- MongoDB Network Access — added 0.0.0.0/0 for development

### First Postman Test — PASSED ✅
- POST /api/auth/register → 200 "User Registered Successfully"
- POST /api/auth/login → 200 JWT token returned
- User document verified in MongoDB Atlas — BCrypt password, all fields correct

**Concepts learned:**
- Authentication vs Authorization
- OncePerRequestFilter — runs exactly once per request
- SecurityContextHolder — stores authenticated user for request duration
- CSRF disabled for JWT REST APIs
- SessionCreationPolicy.STATELESS — JWT apps don't use sessions
- TLS 1.2 vs 1.3 — Java 21 compatibility with MongoDB Atlas

## June 10, 2026

### Phase 5 — Leave Module Complete

**Files built:**
- LeaveType.java — enum (CASUAL, SICK, EARNED)
- LeaveStatus.java — enum (PENDING, APPROVED, REJECTED)
- LeaveRequest.java — MongoDB document with state machine (PENDING → APPROVED/REJECTED)
- LeaveBalance.java — MongoDB document with LeaveQuota inner class
- LeaveRequestRepository.java — findByEmployeeId custom method
- LeaveBalanceRepository.java — findByEmployeeIdAndYear custom method
- LeaveRequestDto.java — request DTO with validation
- LeaveService.java — applyLeave, updateLeaveStatus, getAllLeaves
- LeaveController.java — POST /apply, PUT /{id}/status, GET

**Also fixed from Phase 4 review:**
- JwtFilter order corrected — isTokenValid before extractEmail
- Added null authentication check in JwtFilter
- Added @EnableMethodSecurity to SecurityConfig

**Concepts learned:**
- State machine pattern — PENDING → APPROVED/REJECTED, never backwards
- Static inner class — LeaveQuota inside LeaveBalance
- Switch expression for enum matching
- ChronoUnit.DAYS.between() for date calculation
- List vs Optional — one-to-many vs one-to-one
- @PathVariable vs @RequestParam
- Balance deduction only on APPROVED

## June 11, 2026

### Phase 6 — Dashboard Complete

**Files built:**
- DashboardService.java — 4 analytics methods
- DashboardController.java — 4 GET endpoints

**Methods built:**
- getTodayOnLeave() — employees on approved leave today
- getPendingLeaves() — all PENDING leave requests
- getLeavesByDepartment() — approved leave count per department using HashMap
- getLeaveBalanceSummary() — average remaining balance per leave type using streams

**Also updated:**
- LeaveRequestRepository.java — added findByStatus() and findByStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatus()

**Postman Tests — PASSED ✅**
- GET /api/dashboard/pendingleaves → 200 OK
- GET /api/dashboard/todayleave → 200 OK
- GET /api/dashboard/department → 200 OK
- GET /api/dashboard/summary → 200 OK (sick: 0.0, earned: 0.0, casual: 0.0)

**Concepts learned:**
- Stream API — processes list items one by one through a pipeline
- mapToDouble() — extracts double value from each object in stream
- average().orElse(0.0) — calculates average, returns 0 if empty
- HashMap.merge() — increments count if key exists, creates if not
- Map.of() — creates immutable map with fixed key-value pairs
- Java stream vs for loop — same result, stream is cleaner and modern

### Phase 7 — Email Notifications Complete
- Added spring-boot-starter-mail dependency
- Configured Gmail SMTP in application.properties
- Built EmailService.java — sendLeaveStatusEmail()
- Updated LeaveService.updateLeaveStatus() — triggers email on APPROVED/REJECTED
- App running clean
- Fixed @Document(collection = "leave_balance") mismatch — Spring defaulted to "leaveBalance"
- Postman verified: apply → approve → email delivered ✅

## June 14, 2026

- Holiday

## Tomorrow — Phase 8
- React frontend setup
- Login page
- Role-based routing