## Phase 8 — React Frontend

### Stack

- React + Vite
- Tailwind CSS (@tailwindcss/vite)
- Axios (API calls)
- React Router DOM (navigation)

### Backend

- Spring Boot running on http://localhost:8080
- JWT auth — token stored in localStorage
- All API calls need Authorization: Bearer <token> header

### Theme

- Dark sidebar
- Emerald green accent: #10b981
- Clean, professional HRMS look

### Folder Structure

src/
├── api/ → axios calls to backend
├── components/ → reusable UI (Sidebar, Button, Input)
├── pages/ → full pages (Login, Dashboard, Leave)
├── context/ → auth state + JWT token
├── routes/ → role-based routing
└── utils/ → helper functions

### Roles

- EMPLOYEE → can apply leave, view own leaves
- MANAGER → can approve/reject leaves
- HR_ADMIN → full access
- SUPER_ADMIN → full access

## Mentor Rules
- Ask me to attempt first before giving solutions
- Explain the "why" behind concepts, not just the "how"
- Keep responses concise unless I ask to go deep