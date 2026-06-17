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

## June 12, 2026
- Phase 7 Postman testing completed
- Fixed @Document(collection = "leave_balance") mismatch
- Registered MGR001 (MANAGER role) for testing
- Applied leave as EMP001 → Approved by MGR001 → Email delivered ✅
- Git commit: Phase 7 complete

## June 13, 2026

### Phase 8 — React Frontend Started
**Setup:**
- Created Vite + React project (worknest_frontend)
- Installed Tailwind CSS (@tailwindcss/vite), Axios, React Router DOM
- Configured vite.config.js and index.css

**Login page built:**
- Dark/light theme toggle using useState
- Controlled inputs (email, password) with onChange
- Axios POST to /api/auth/login
- JWT token stored in localStorage
- useNavigate to redirect to /dashboard on success
- CORS configured in SecurityConfig for localhost:5173

**Concepts learned:**
- JSX and className vs class
- useState — why normal variables don't trigger re-render
- Controlled inputs — value + onChange
- e.target.value — event object
- async/await — waiting for API response
- localStorage — browser-side persistent storage
- React Router — URL to page mapping
- absolute/relative positioning in Tailwind
- Template literals for dynamic classNames

## June 14, 2026

- Holiday

## June 15, 2026

### Phase 8 — Dashboard + Sidebar Complete
**Files built:**
- ThemeContext.jsx — global dark/light state using createContext
- ProtectedRoute.jsx — checks token existence + expiry, redirects to login
- Dashboard.jsx — layout with sidebar + main content
- Sidebar.jsx — reusable component with nav links + logout

**Features:**
- JWT decoded using jwt-decode — name + role extracted
- Logout — clears localStorage token, redirects to login
- Protected Route — expired/missing token redirects to login
- Sidebar extracted as reusable component

**Concepts learned:**
- createContext + useContext — global state without prop drilling
- Context Provider — wraps app in main.jsx
- Named vs default exports
- Link vs a href — no page reload with Link
- mt-auto — pushes element to bottom in flex column
- flex-1 — fills remaining space
- Children prop — component wrapper pattern

## June 16, 2026

### Phase 8 — Frontend Progress
- My Leaves page — table with APPROVED/REJECTED/PENDING color badges
- Apply Leave page — form with success message, styled
- Manager Dashboard — started, PENDING filter added
- Routes added for all pages in App.jsx
- Leave balance endpoint added to backend (GET /api/leaves/balance)
- employeeId and name added to JWT claims
- ThemeContext — global dark/light state using createContext
- ProtectedRoute — checks token existence + expiry, redirects to login
- Dashboard layout — Sidebar + leave balance cards
- Sidebar extracted as reusable component with Logout
- JWT decode using jwt-decode library

**Concepts learned:**
- useEffect — run code on component load
- .map() — render lists in JSX
- .filter() — filter array before rendering
- key prop — why React needs unique keys
- {} vs () in arrow functions
- span vs div — inline vs block
- createContext + useContext — global state
- Children prop — component wrapper pattern
- Link vs a href — no page reload
- mt-auto — pushes element to bottom in flex
- localStorage — browser persistent storage
- async/await — waiting for API response
- axios headers — passing JWT to protected endpoints

## June 17, 2026

### Phase 8 — Manager Dashboard + Role-Based Routing Complete

**Manager Dashboard:**
- handleApprove/handleReject — single function using leaveStatus parameter
- Fixed backend bug: getAllLeaves now returns all leaves for MANAGER role (previously only returned manager's own leaves)
- Approve (green) / Reject (red) buttons styled
- Auto-refresh table after action via fetchLeaves() re-call

**Role-Based Routing:**
- Login redirect — EMPLOYEE → /dashboard, MANAGER/HR_ADMIN/SUPER_ADMIN → /managerdashboard
- Sidebar — Manager Dashboard link conditionally shown based on role
- ProtectedRoute upgraded — accepts allowedRoles prop, blocks unauthorized roles
- Fixed UX — unauthorized role access redirects to /dashboard (not login), since user is still authenticated

**Decisions:**
- MANAGER can apply for own leave (Dashboard/ApplyLeave/MyLeaves open to all roles)
- HR_ADMIN/SUPER_ADMIN temporarily use Manager Dashboard until dedicated pages built

**Concepts learned:**
- .includes() array method
- Short-circuit evaluation with && for optional props
- Passing custom props through wrapper components
- localStorage shared across browser tabs (not per-tab) — clarified as testing limitation, not production bug
- CI/CD basics — Railway/Vercel auto-deploy as built-in CD, GitHub Actions for full CI (V2 addition)

## June 18, 2026 (Planned)

- Error handling (Login — wrong credentials, network errors)
- Profile page
- Loading states