# FASTPRINTKE Monorepo

MERN app with:
- backend: Node.js/Express API + MongoDB
- frontend: React (Vite + TypeScript + Tailwind)
- Auth: Clerk
- Storage: Cloudinary

---

## 1) Prerequisites
- Node 18+
- npm
- MongoDB Atlas account (free)
- Cloudinary account (free)
- Clerk account (free)
- GitHub + Vercel (frontend) + Render (backend)

---

## 2) Environment variables

Create a `.env` file in each app (or set in hosting dashboards):

Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:4000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
```

Backend (Render dashboard env, or `.env` for local)
```
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/fastprintke
JWT_SECRET=dev-secret-change-me
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=unsigned_preset
```

---

## 3) Install dependencies

Frontend
```
cd frontend
npm i
npm i @clerk/clerk-react
```

Backend
```
cd backend
npm i
npm i @clerk/clerk-sdk-node
```

---

## 4) Local development

Terminal A (backend)
```
cd backend
npm run dev
```

Terminal B (frontend)
```
cd frontend
npm run dev
```

Open http://localhost:5173

---

## 5) Production build

Frontend
```
cd frontend
npm run build
npm run preview
```

Backend
```
cd backend
npm run build
node dist/server.js
```

---

## 6) Deploy

### Frontend (Vercel)
1. Push repo to GitHub
2. Vercel → New Project → Import
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment Variables:
   - `VITE_API_URL=https://<your-backend>.onrender.com/api`
   - `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`
7. Deploy

### Backend (Render)
1. New Web Service → Import GitHub repo (backend folder)
2. Build Command: `npm install && npm run build`
3. Start Command: `node dist/server.js`
4. Environment Variables (from above)
5. Add a Health Check Path: `/api/status`
6. Deploy

### Database (MongoDB Atlas)
1. Create free cluster and database user
2. Network Access: allow 0.0.0.0/0 (dev) or specific IPs
3. Get connection string → set as `MONGODB_URI`

### Cloudinary
1. Create an unsigned upload preset (Settings → Upload → Upload presets)
2. Put `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` into Render env

### Clerk
1. Create application in Clerk dashboard
2. Copy `Publishable key` and `Secret key`
3. Add allowed origins (localhost, Vercel domain)
4. Set keys in envs (frontend/backend)

---

## 7) Auth details
- Frontend uses Clerk Provider. The Auth route uses `<SignIn />` / `<SignUp />`.
- Axios attaches a Clerk Bearer token automatically if available.
- Backend middleware verifies Clerk token and upserts the user (`/api/auth/clerk/me`).
- Legacy cookie auth endpoints remain but are optional.

---

## 8) Uploads
- If Cloudinary envs are present, images are uploaded to Cloudinary and return `secure_url`.
- If not, API falls back to local `/uploads` (ephemeral on free hosts).

---

## 9) CORS
Set `CORS_ORIGIN` to include all frontend origins, comma-separated.

---

## 10) Troubleshooting
- Missing Clerk modules → run installs noted above.
- 401 on `/auth/clerk/me` → ensure Bearer token is sent and `CLERK_SECRET_KEY` is set.
- Upload fails → verify Cloudinary preset and cloud name.
