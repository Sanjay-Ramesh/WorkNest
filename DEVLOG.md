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
- As of now no update

## Tomorrow — Phase 3
- Auth module begins
- RegisterRequest DTO
- LoginRequest DTO
- UserService
- AuthController
- JWT setup
