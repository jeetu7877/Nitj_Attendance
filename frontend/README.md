# NITJ Classroom — AI Attendance Platform (React + Vite)

Production-grade React frontend for the NITJ Classroom AI attendance system, converted from the original single-file CDN Babel app to a proper Vite project with clean component architecture.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and set your API URL
cp .env.example .env
# Edit .env → set VITE_API_URL

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of your Render Lite backend (e.g. `https://your-app.onrender.com`) |

**Local dev:** Leave `VITE_API_URL` unset (or set to `http://localhost:8000`) — the client auto-detects localhost and uses port 8000.

**Production:** Set `VITE_API_URL` to your deployed Render backend URL.

```env
# .env (production)
VITE_API_URL=https://your-lite-backend.onrender.com
```

---

## Build & Deploy

```bash
# Build for production
npm run build
# Output in dist/

# Preview production build locally
npm run preview
```

### Deploy to Netlify
1. Connect your repo on [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`
5. Add a `_redirects` file in `public/` with: `/* /index.html 200`

### Deploy to Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Framework preset: Vite
3. Add environment variable: `VITE_API_URL`
4. Deploy

---

## CORS Configuration

The FastAPI Lite backend must allow requests from your frontend domain.

**Development** — allow all origins (already configured):
```python
allow_origins=["*"]
```

**Production (recommended)** — restrict to your exact frontend URL:
```python
allow_origins=["https://your-frontend.netlify.app"]
```

---

## Project Structure

```
src/
  api/           # Fetch wrappers for every backend endpoint
  context/       # AuthContext, ToastContext, ThemeContext
  components/
    layout/      # Sidebar, Topbar, MobileHeader, BottomNav, AppShell
    common/      # Icon, Button, Modal, Toast, Spinner, Badge, Skeleton
    auth/        # AuthShell, LoginForm, RegisterForm, OtpBoxes, ...
    classroom/   # ClassCard, ClassFeed, AttendanceTakerPanel, ...
    assignments/ # AssignmentCard, CreateAssignmentModal, SubmissionsModal
    profile/     # ProfileTab, SecurityTab, SettingsTab
    notifications/ # NotificationItem
  pages/         # One file per route
  hooks/         # useCamera, useCountdown, usePolling
  utils/         # formatDate, validators
  styles/        # theme.css, base.css, components.css, responsive.css
  App.jsx        # Router + protected/guest route wrappers
  main.jsx       # Entry point, CSS imports
```

---

## Backend Limitations (reproduced as-is from original)

- **No `PUT /me` endpoint** — profile edits are local-only (stored in React state, not persisted server-side).
- **No real password-change endpoint** — the Security tab verifies the old password via `/login`, then redirects to the `/forgot-password` OTP flow to set a new one.
- **Email verification** — currently disabled in the v10.2 direct-registration backend. The `VerifyEmailPage` is a fully functional stub for when it's re-enabled.
- **Face encoding latency** — face encoding now happens on the separate Face Service (Railway/Fly.io), so join/recognize calls may be slightly slower. The frontend surfaces backend error messages like "Face service unavailable" verbatim.

---

## Tech Stack

- React 18 + Vite 5
- react-router-dom v6
- No CSS framework — hand-written CSS variables matching original design
- No Redux — React Context for auth + toast + theme
- Native `fetch` wrapped in `src/api/client.js`
