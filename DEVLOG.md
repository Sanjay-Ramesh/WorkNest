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

## June 18, 2026

### Phase 8 — Frontend Complete

**Login error handling:**
- try-catch added to handleLogin
- Shows "Invalid Email or Password" below Login button on failed attempts

**Profile page:**
- Backend: UserController + UserService + ProfileResponse DTO (excludes password field)
- Frontend: Profile.jsx displays all user fields, active rendered as "Yes/No" (React doesn't render booleans)
- Fixed route casing /Profile → /profile

**Loading states:**
- Dashboard, MyLeaves, ManagerDashboard, Profile — fetch-on-load pattern
- ApplyLeave — submit-on-click pattern, button disables + shows "Submitting..." during request

**HR Dashboard:**
- HRDashboard.jsx — 4 sections: Today Leaves, Pending Leaves, Department Breakdown, Leave Balance Summary
- Promise.all() for parallel fetching, single setLoading(false) after all 4 complete
- Object.entries() for iterating Map<String, Long/Double> responses (department/summary data)
- Sidebar updated — HR Dashboard link visible only to HR_ADMIN/SUPER_ADMIN
- Fixed operator precedence bug (|| vs &&) without parentheses
- Tested end-to-end with HR001 account — all 4 sections working

**Design decision:**
- Reviewed worknest_mockup.html (dark theme, emerald green, stat cards, AI insight)
- V1 ships with current simple styling (June 25 deadline)
- Full visual redesign → V1.5 immediately after going live (3-4 days effort)
- V1.5 scope documented in DEVLOG

**Concepts learned:**
- Promise.all() — parallel API calls, single loading flag
- Object.entries() — convert object to iterable array
- Operator precedence — && before ||, parentheses needed for OR conditions
- Default vs named exports — import Sidebar vs import { Sidebar }
- Backend computation vs frontend data consumption

## June 19, 2026

### Security Audit + Fixes + Register Page + E2E Testing

**Security Audit (Claude Code):**
- Full codebase audit performed — 17 issues found across backend and frontend
- Confirmed application.properties never committed to GitHub (credentials safe locally)
- All critical/high issues fixed before deployment

**Security Fixes Applied:**

Fix #1 — Role extracted from JWT principal (@AuthenticationPrincipal) instead of @RequestParam
- LeaveController.getAllLeaves() no longer trusts client-supplied role
- LeaveService.getAllLeaves() now accepts caller email, fetches real role from DB

Fix #2 — @PreAuthorize added to updateLeaveStatus()
- CustomUserDetailsService now loads role as authority (SimpleGrantedAuthority)
- LeaveController.updateLeaveStatus() guarded with hasAuthority('MANAGER','HR_ADMIN','SUPER_ADMIN')
- managerId removed from query param — fetched from JWT principal instead
- Key learning: hasAuthority('MANAGER') vs hasRole('MANAGER') — hasRole looks for ROLE_MANAGER prefix

Fix #3 — Role removed from RegisterRequest
- All registrations now hardcode Role.EMPLOYEE
- Existing MGR001/HR001 users unaffected (already in MongoDB)
- DataSeeder + admin endpoint deferred to V2 (Employee Management feature)

Fix #4 — @Valid + date validation added to applyLeave()
- @Valid annotation added to LeaveController.applyLeave()
- endDate >= startDate validation added in LeaveService
- Prevents NPE crash and negative-day leaves being saved

Fix #5 — Leave balance deduction fixed (hardcoded 1 → totalDays)
- LeaveService.updateLeaveStatus() now uses leaveRequest.getTotalDays()
- 5-day leave now correctly deducts 5 days from balance

Fix #6 — try/catch/finally added to all frontend async functions
- Dashboard, MyLeaves, ManagerDashboard, Profile, HRDashboard, ApplyLeave
- setLoading(false) in finally block — loading never stuck forever on error

Fix #7 — GlobalExceptionHandler.java created
- @RestControllerAdvice catches RuntimeException
- Returns clean JSON error responses, no stack traces exposed

Fix #8 — HR_ADMIN login redirect fixed
- Login.jsx now redirects HR_ADMIN/SUPER_ADMIN to /hrdashboard
- EMPLOYEE → /dashboard, MANAGER → /managerdashboard, HR_ADMIN/SUPER_ADMIN → /hrdashboard

Fix #9 — Hardcoded localhost URLs replaced with VITE_API_URL
- All axios.get/post/put calls now use import.meta.env.VITE_API_URL
- .env created for local dev (VITE_API_URL=http://localhost:8080)
- .env.production created for Railway URL (to be filled after deployment)
- .env.example tracked on GitHub with placeholder values
- .env and .env.production added to .gitignore

**Bugs found and fixed during Playwright testing:**
- ManagerDashboard.jsx — double quote instead of backtick on axios URL (URL never interpolated)
- HRDashboard.jsx — same double quote bug on all 4 axios calls

**Register Page built:**
- Register.jsx — name, email, password, employeeId, department, joinedDate fields
- No role field (backend hardcodes EMPLOYEE after Fix #3)
- Error handling with try/catch
- Redirects to login on success
- "Already have an account? Login" link
- Route added in App.jsx (no ProtectedRoute — public page)
- "Don't have an account? Register" link added to Login.jsx

**Playwright E2E Tests — 5/5 PASSING:**
- Test 1: Register flow (timestamp-based email for idempotency)
- Test 2: Employee full journey (login, dashboard, apply leave, my leaves, profile, security redirect)
- Test 3: Manager flow (login, approve leave, row disappears)
- Test 4: HR Admin flow (login, all 4 dashboard sections verified)
- Test 5: Security checks (EMPLOYEE blocked from /managerdashboard and /hrdashboard)
- Credentials moved to .env, referenced via process.env in tests

**Concepts learned:**
- @AuthenticationPrincipal — Spring Security injects verified JWT user automatically
- @PreAuthorize — method-level security guard
- SimpleGrantedAuthority — how Spring Security attaches roles to authenticated users
- hasAuthority() vs hasRole() — prefix difference (ROLE_X vs X)
- Bootstrap problem — how first admin account is created in real systems
- Integration vs E2E testing — unit tests verify logic, E2E tests verify full user journey
- Playwright — browser automation for E2E testing
- .env.example pattern — safe credential placeholder for collaborators

### Phase 8 ✅ Fully Complete (including security hardening)

## June 20, 2026

### Security Hardening + Cross-Department Fix

**Security rescan (Claude Code + GitHub):**
- Confirmed application.properties never in git history ✅
- Found CRITICAL issue: real personal email and 
  passwords hardcoded as fallbacks in worknest.spec.js — now in git history
- Found zip file in git history (commit be264df3) — only contained 
  spring.application.name=worknest, no real credentials

**Fixes applied:**
- worknest.spec.js — removed all hardcoded credential fallbacks, replaced with || ''
- .env.example — added placeholder values for all 8 test credential variables
- playwright.config.js — added dotenv import so .env auto-loads before tests run
- package.json — added dotenv as devDependency

**Demo accounts cleanup:**
- Deleted all personal accounts (sanjay@worknest.com, 
  old manager account) from MongoDB Atlas
- Kept clean demo accounts only:
  - emp@worknest.com (EMP001, Engineering, EMPLOYEE)
  - manager@worknest.com (MGR001, Engineering, MANAGER)
  - hr@worknest.com (HR001, HR, HR_ADMIN)
- Updated .env with demo credentials (demo123)

**Cross-department visibility fix:**
- Added department field to LeaveRequest.java model
- LeaveRequestRepository — added findByDepartment(String department) method
- LeaveService.applyLeave() — now saves employee's department when creating LeaveRequest
- LeaveService.getAllLeaves() — MANAGER now sees only own department leaves 
  (findByDepartment), HR_ADMIN still sees all (findAll())
- Previously MANAGER could see ALL employees' leaves across all departments — security gap closed

**Pending:**
- Playwright E2E rerun with new demo credentials — in progress
- Cross-department test with EMP002 (Sales) + MGR002 (Sales) — pending

## June 21, 2026

- Holiday

## June 22, 2026

### Security Hardening + Cross-Department Fix + Git History Cleanup

**Security rescan findings:**
- CRITICAL: promote-managers.js committed with live MongoDB URI + password 
- CRITICAL: test-results/error-context.md committed with Gmail app password 
  - Root cause: test-results/ not gitignored — Playwright error logs captured backend network 
    responses containing credentials during a failed test run
- MEDIUM: backend.log was tracked in git
- MEDIUM: test-results/ folder was tracked in git

**Fixes applied:**
- test-results/ added to .gitignore
- backend.log added to .gitignore
- Git history cleaned using git filter-repo — purged 3 sensitive files from all 48 commits
  - promote-managers.js
  - worknest_backend/backend.log
  - worknest_frontend/test-results/**
- Force pushed to GitHub — verified clean
- Backup created: WorkNest_backup_20260622.zip on Desktop
- All commit hashes rewritten (expected behavior with filter-repo)

**Credentials rotated:**
- MongoDB Atlas password rotated — updated in application.properties locally
- Gmail App Password revoked and regenerated — updated in application.properties locally
- Note: application.properties is gitignored — credentials never leave local machine

**Playwright test file hardening:**
- worknest.spec.js — all hardcoded fallback credentials replaced with || ''
- .env.example — placeholder values added for all 8 test credential variables
- playwright.config.js — dotenv added so .env auto-loads before tests run
- package.json — dotenv added as devDependency

**Demo accounts cleanup:**
- Deleted all personal accounts from MongoDB Atlas
- Clean demo accounts created:
  - emp@worknest.com / demo123 (EMP001, Engineering, EMPLOYEE)
  - manager@worknest.com / demo123 (MGR001, Engineering, MANAGER)
  - hr@worknest.com / demo123 (HR001, HR, HR_ADMIN)
- .env updated with new demo credentials

**Cross-department visibility fix:**
- Added department field to LeaveRequest.java
- LeaveRequestRepository — added findByDepartment(String department)
- LeaveService.applyLeave() — saves employee's department on leave creation
- LeaveService.getAllLeaves() — MANAGER sees only own department (findByDepartment),
  HR_ADMIN still sees all (findAll())
- Previously MANAGER saw ALL departments — security gap closed

**Playwright E2E — 13/13 PASSING ✅**
- Register Flow: 2/2
- Employee Flow: 1/1
- Manager Flow: 1/1
- HR Admin Flow: 1/1
- Security Checks: 3/3
- Department Leave Isolation: 5/5
- Verified passing after git history cleanup and credential rotation (40.5s total)

**Concepts learned:**
- git filter-repo — purge specific files from entire git history without losing commits
- Force push — required after history rewrite (commit hashes change)
- Playwright error logs — auto-generated files can capture sensitive network data
- gitignore importance — test-results/, logs, .env must always be excluded
- MongoDB connection lifecycle — backend stays connected after startup, 
  password change only affects new connections (must update application.properties + restart)

## June 23, 2026

### Pre-Deployment Fixes + Security Infrastructure Complete

**Security infrastructure (permanent):**
- ggshield pre-commit hook installed — blocks credentials at commit time
- Pre-push hook — scans commits before reaching GitHub
- .gitignore extended — all Playwright artifacts, logs, scripts covered
- SECURITY.md — documents never-commit files, credential rotation process
- .env validation in Playwright — tests halt if credentials missing
- Playwright configured: trace:off, video:off — no network data captured in error logs

**V1 bug fixes:**
- Leave balance reset for all demo accounts (EMP001/MGR001/HR001) → Casual:12, Sick:8, Earned:15
- MyLeaves fix — all roles now see only own leaves (was showing department/all leaves for MANAGER/HR_ADMIN)
- Apply Leave fix — MANAGER and HR_ADMIN were throwing "Only Employees can apply" error — fixed
- HR_ADMIN leave auto-approved (no higher role in V1)
- SECURITY.md personal info replaced with YOUR_* placeholders

**Playwright E2E — 13/13 PASSING ✅**

## June 24, 2026

### Phase 9 — Deployment Complete 🚀

**Backend — Railway:**
- Spring Boot deployed successfully
- Issues fixed during deployment:
  - JWT_EXPIRATION typo (j86400000 → 86400000)
  - Mail variables renamed to SPRING_MAIL_* format
  - MongoDB URI renamed to SPRING_DATA_MONGODB_URI
  - MongoDB Atlas password mismatch → rotated and updated
- Final Railway variables: SPRING_DATA_MONGODB_URI, JWT_SECRET, JWT_EXPIRATION,
  SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD, SPRING_MAIL_HOST, SPRING_MAIL_PORT,
  SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH, SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE,
  FRONTEND_URL
- Live at: https://worknest-production-dcf8.up.railway.app

**Frontend — Vercel:**
- React + Vite deployed successfully
- Root Directory set to worknest_frontend
- VITE_API_URL set to Railway backend URL
- Live at: https://work-nest-iota-nine.vercel.app

**Post-deployment fixes:**
- 404 on page refresh — fixed with vercel.json SPA rewrite rule (3 lines)
- Manager Dashboard UI not updating after approve/reject — root cause: Railway blocks
  SMTP ports 587/465, Gmail timeout caused backend to return 400, catch block prevented
  UI update. Fixed with @Async on sendLeaveStatusEmail — email runs in separate thread,
  approve returns 200 immediately, UI updates correctly
- Leave balance stale data — old test data from dev phases, not a code bug. Cleared
  all pre-June-24 leave records from Atlas, reset EMP001/HR001 balances manually

**CORS:**
- SecurityConfig updated to read FRONTEND_URL from environment variable
- Railway variable FRONTEND_URL set to Vercel URL

**Pending:**
- Login page click-to-fill demo credentials
- LinkedIn post

### Phase 9 ✅ Complete — WorkNest V1 is LIVE!
### Live URLs:
- Backend: https://worknest-production-dcf8.up.railway.app
- Frontend: https://work-nest-iota-nine.vercel.app