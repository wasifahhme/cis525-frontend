# 🚗 CIS525 – AI‑Powered Itinerary Generator (Full‑Stack)

Multi‑page, mobile‑friendly **React + Vite + Tailwind + barba.js** frontend connected to a **FastAPI** backend.
The app supports **Sign up / Login**, **protected routes**, and **Itinerary CRUD** that stores/reads JSON itineraries.

> This README encapsulates everything needed to run, debug, and verify both stacks locally.

---

## 🗂 Project Layout

```
cis525_backend/
├─ main.py
├─ auth_customers.py            # signup/login routes (stub or real DB)
├─ db.config                    # SQL schema
└─ requirements.txt

cis525_frontend/
├─ .env
├─ package.json
├─ vite.config.js
├─ postcss.config.js
├─ tailwind.config.js
└─ src/
   ├─ App.jsx                   # routes + <div data-barba="wrapper">
   ├─ styles.css                # Tailwind + barba fade CSS
   ├─ hooks/
   │  └─ useBarba.js            # SPA-safe transitions (no PJAX)
   ├─ api/
   │  ├─ client.js              # axios base + diagnostics
   │  └─ auth.js                # login/signup (multi-alias probing)
   └─ pages/                    # Landing, Login, Signup, Dashboard, Itineraries, Profile
```

---

## 🧱 Backend (FastAPI)

### 1) Install
```bash
cd cis525_backend
pip install -r requirements.txt
```

### 2) Database schema (from `db.config`)
```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE itineraries (
    itinerary_id SERIAL PRIMARY KEY,
    customer_id  INT NOT NULL,
    itinerary_name VARCHAR(255) NOT NULL,
    itinerary_data JSON,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);
```

### 3) Minimal auth routes to unblock the UI
`auth_customers.py` (stub – replace with real DB later):
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api", tags=["auth_customers"])
_fake_db = {}
_fake_id_seq = 1

class SignupIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

@router.post("/customers")
def create_customer(payload: SignupIn):
    global _fake_id_seq
    if payload.email in _fake_db:
        raise HTTPException(status_code=409, detail="Email already exists")
    customer = {
        "customer_id": _fake_id_seq,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "email": payload.email,
    }
    _fake_db[payload.email] = {"password": payload.password, "customer": customer}
    _fake_id_seq += 1
    return {"token": f"fake-jwt-{customer['customer_id']}", "customer": customer}

@router.post("/auth/login")
def login(payload: LoginIn):
    row = _fake_db.get(payload.email)
    if not row or row["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    customer = row["customer"]
    return {"token": f"fake-jwt-{customer['customer_id']}", "customer": customer}
```

Register in `main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth_customers import router as auth_customer_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_customer_router)

@app.get("/")  # optional sanity
def root():
    return {"ok": True}
```

### 4) Run
```bash
uvicorn main:app --reload --port 8000
# sanity checks
curl -i http://127.0.0.1:8000/
open http://127.0.0.1:8000/docs
```

---

## 💅 Frontend (React + Vite + Tailwind + barba.js)

### 1) Install
```bash
cd cis525_frontend
npm install
```

> If `@barba/core` version fails, use a known-good: `npm i @barba/core@^2.9.7`

### 2) Environment
Create `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
> Use `127.0.0.1` to avoid IPv6/localhost quirks. Restart Vite after edits.

### 3) Run
```bash
npm run dev
# Vite usually runs on 5173; if busy, it will pick 5174. Match that in CORS.
```

### 4) Key files

**`src/App.jsx`** (wrapper needed by Barba):
```jsx
<div id="barba-wrapper" data-barba="wrapper">
  {/* routes rendered here */}
</div>
```

**`src/hooks/useBarba.js`** (SPA-safe, no PJAX — only fade classes):
```js
import barba from '@barba/core'
import { useEffect } from 'react'

export default function useBarba(namespace){
  useEffect(() => {
    try { barba.destroy() } catch {}
    barba.init({
      prevent: () => true, // don't hijack links; React Router handles routing
      transitions: [{
        name: 'react-fade',
        once(){ fadeIn() }, enter(){ fadeIn() }, leave(){},
      }]
    })
    return () => { try { barba.destroy() } catch {} }
  }, [namespace])
}

function fadeIn(){
  const el = document.querySelector('main')
  if(!el) return
  el.classList.add('barba-enter')
  requestAnimationFrame(()=>{
    el.classList.add('barba-enter-active')
    el.classList.remove('barba-enter')
  })
  setTimeout(()=> el.classList.remove('barba-enter-active'), 250)
}
```

**`src/styles.css`** (Tailwind + fade CSS):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.barba-enter { opacity: 0; }
.barba-enter-active { opacity: 1; transition: opacity .25s ease; }
```

**`src/api/client.js`** (diagnostics + token header):
```js
import axios from 'axios'
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
const client = axios.create({ baseURL: BASE, timeout: 10000, headers: {'Content-Type':'application/json'} })

client.interceptors.request.use((config)=>{
  const auth = localStorage.getItem('auth')
  if(auth){ const { token } = JSON.parse(auth); if(token) config.headers.Authorization = `Bearer ${token}` }
  if(import.meta.env.DEV) console.debug('[API] →', config.method?.toUpperCase(), config.baseURL + config.url)
  return config
})

client.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status
    const isNetwork = !!(err?.code === 'ERR_NETWORK' || err?.message?.toLowerCase().includes('network'))
    const msg = isNetwork
      ? 'Network error: frontend could not reach the backend. Check VITE_API_BASE_URL and CORS.'
      : (err?.response?.data?.detail || err.message || 'Request failed')
    const enriched = Object.assign(new Error(msg), { status, original: err, url: err?.config?.baseURL + err?.config?.url })
    if(import.meta.env.DEV) console.error('[API ERROR]', enriched)
    return Promise.reject(enriched)
  }
)

export default client
```

**`src/api/auth.js`** (multi-alias probing; lock to exact routes if known):
```js
import client from './client.js'

async function tryPost(paths, payload){
  const tried = []
  for(const path of paths){
    tried.push(path)
    try { const { data } = await client.post(path, payload); return data }
    catch(err){ if(err?.status === 404) continue; throw err }
  }
  throw Object.assign(new Error(`No matching endpoint on backend. Tried: ${tried.join(', ')}`), { code: 'NO_ROUTE' })
}

export async function login(email,password){
  return await tryPost(['/api/auth/login','/auth/login','/login'], { email, password })
}

export async function signup(payload){
  return await tryPost(['/api/customers','/customers','/auth/register','/register'], payload)
}
```

---

## ✅ Manual Verification

1. Backend up: open `http://127.0.0.1:8000/docs`.
2. Frontend up: open `http://localhost:5173` (or 5174).
3. **Sign up** → should create account and store `{token, customer}` in `localStorage` as `auth`.
4. **Login** → should return same shape.
5. Create itinerary: paste valid JSON (root `"itinerary"` array), save, then open detail page.

**Itinerary JSON example:**
```json
{
  "itinerary": [
    {
      "day": 1,
      "driving_summary": { "start": "Detroit, MI", "end": "Toledo, OH", "estimated_time": "1h" },
      "activities": [{ "name": "Museum", "description": "Explore exhibits" }],
      "food_suggestions": [{ "name": "Local BBQ", "description": "Best smoked meats" }],
      "overnight_lodging_suggestion": { "location": "Toledo, OH", "description": "Downtown hotel" }
    }
  ]
}
```

---

## 🛠️ Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Blank page | Barba wrapper missing or runtime error | Ensure `<div data-barba="wrapper">` and check Console for first error |
| “Network error” | Wrong API base or backend down | Set `VITE_API_BASE_URL=http://127.0.0.1:8000`, restart Vite, confirm backend is running |
| CORS error / Preflight failed | Missing CORS | Add `CORSMiddleware` with 5173 & 5174 origins |
| 404 on signup/login | Routes not implemented | Add `POST /api/customers`, `POST /api/auth/login` (see stubs) or adjust `auth.js` to your paths |
| JSON invalid when saving itinerary | Missing root `itinerary` array | Follow the example JSON above |

**Ports busy?**  
```bash
# macOS
lsof -i :5173
kill -9 <PID>
# force Vite port
npm run dev -- --port 5174
```

---

## 📌 API Contract (expected by frontend)

- **POST** `/api/customers` → `{ token, customer }`
- **POST** `/api/auth/login` → `{ token, customer }`
- **GET** `/api/customers/{customer_id}/itineraries` → list
- **POST** `/api/customers/{customer_id}/itineraries` → create
- **GET/PUT/DELETE** `/api/itineraries/{itinerary_id}` → detail/update/delete

> If your paths differ, update `src/api/*.js` accordingly.

---

## 🚀 Next Steps / Enhancements

- Replace in‑memory store with real DB (hash passwords with `bcrypt`).
- Implement itinerary CRUD in the backend using your schema.
- Add “Generate from Gemini” endpoint → save JSON directly to `/itineraries`.
- Deploy on AWS (FastAPI + Nginx + PM2/uvicorn; Vite build served by Nginx).

---

**You’re good to go.**  
Frontend and backend are aligned, transitions are in, and the debugging playbook is baked into this README.
