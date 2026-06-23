# WorkNest — Security Guide

## Files that must NEVER be committed

| File | Why |
|---|---|
| `worknest_backend/src/main/resources/application.properties` | Contains live MongoDB URI, JWT secret, Gmail app-password |
| `worknest_backend/src/main/resources/application-prod.properties` | Production overrides |
| `worknest_frontend/.env` | Contains test account credentials |
| `worknest_frontend/.env.production` | Contains production API URL |
| `promote-managers.js`, `seed-*.js`, `cleanup-*.js` | One-off scripts that may embed live credentials |

All of the above are covered by `.gitignore`. **Never use `git add -f` on them.**

Use `application.example.properties` and `.env.example` as templates — they contain only placeholders.

---

## Automated protection in place

### Pre-commit hook (`.git/hooks/pre-commit`)
Runs on every `git commit`. Blocks if any staged file contains:
- MongoDB URI with embedded credentials (`mongodb+srv://user:pass@...`)
- Gmail app-password pattern (4×4 lowercase letter groups)
- AWS AKIA access keys
- PEM private key headers
- Hardcoded JWT secrets (non-placeholder values)

Layer 2: ggshield cloud scan runs automatically if `GITGUARDIAN_API_KEY` is set.

### Pre-push hook (`.git/hooks/pre-push`)
Runs on every `git push`. Re-scans the commits being pushed using the same patterns, plus:
- Checks that no `.env` or `application.properties` file appears in any commit being pushed
- Runs `ggshield secret scan commit-range` if `GITGUARDIAN_API_KEY` is set

### Playwright env validation (`tests/global-setup.js`)
Runs before every Playwright test suite. If any required `TEST_*` variable is missing from `.env`, the suite fails immediately with a clear message listing which vars are absent — prevents silent auth failures mid-test.

---

## Enabling ggshield cloud scanning

ggshield is already installed. Activate cloud scanning (free tier available):

```bash
# Option A — interactive browser login (one-time)
ggshield auth login

# Option B — API key via environment variable
# 1. Create free account at https://dashboard.gitguardian.com
# 2. Go to API → Personal access tokens → Create token
# 3. Add to your shell profile:
export GITGUARDIAN_API_KEY=your_token_here
```

Once set, both the pre-commit and pre-push hooks will automatically run ggshield.

---

## How to rotate credentials

### MongoDB Atlas password
1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → Database Access
2. Find the WorkNest DB user → Edit Password → Auto-generate
3. Copy the full connection string Atlas gives you
4. Update `worknest_backend/src/main/resources/application.properties`:
   ```
   spring.data.mongodb.uri=YOUR_MONGODB_URI
   ```
5. Update the same variable in Railway environment variables if deployed

### Gmail app-password
1. Go to [Google Account](https://myaccount.google.com) → Security → 2-Step Verification → App passwords
2. Revoke the existing WorkNest app-password
3. Create a new one (select "Mail" + "Windows Computer")
4. Update `worknest_backend/src/main/resources/application.properties`:
   ```
   spring.mail.password=YOUR_NEW_APP_PASSWORD
   ```
5. Update in Railway environment variables if deployed

### JWT secret
Replace the current passphrase with a proper 256-bit random key:
```bash
# Generate a secure key
openssl rand -base64 32
```
Update `application.properties`:
```
jwt.secret=YOUR_GENERATED_SECRET
```

---

## Running a manual security scan

```bash
# Scan all local files (current working tree)
detect-secrets scan --all-files | python -m json.tool

# Scan full git history for secrets in committed files
git log --all -p | grep "^+" | grep -iE "(password|secret|api.key|token)" | grep -v "placeholder\|example\|your_"

# ggshield scan (requires GITGUARDIAN_API_KEY or ggshield auth login)
ggshield secret scan repo .

# Run before pushing (same as pre-push hook does automatically)
ggshield secret scan commit-range origin/main..HEAD
```

---

## Before making the repo public

- [ ] Confirm `application.properties` is in `worknest_backend/.gitignore` — `git ls-files application.properties` must return nothing
- [ ] Confirm `.env` is in `worknest_frontend/.gitignore` — `git ls-files .env` must return nothing  
- [ ] Run `git log --all -p | grep "^+" | grep -iE "mongodb\+srv|password.*=|api.key"` — must return only placeholders
- [ ] Rotate MongoDB password and Gmail app-password before any real users access the app
- [ ] Replace JWT secret with output of `openssl rand -base64 32`
