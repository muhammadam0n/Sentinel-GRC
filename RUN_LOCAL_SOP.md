# Sentinel GRC — Run Locally (SOP)

This SOP runs the project locally as two services:

- Backend: FastAPI (Python) on `http://127.0.0.1:8000`
- Frontend: Vite (React) on `http://127.0.0.1:5173`

## 1) Prerequisites

Install these on your machine:

- Node.js 18+ (recommended: 20+)
- Python 3.11+ (recommended: 3.12) (ensure “Add Python to PATH” is enabled)

Verify:

```powershell
node --version
npm --version
python --version
python -m pip --version
```

## 2) Backend (FastAPI)

### 2.1 Create a virtual environment + install dependencies

From the project root:

```powershell
cd E:\Sentinel_GRC

python -m venv backend\.venv
backend\.venv\Scripts\python -m pip install -r backend\requirements.txt
```

Optional (reports export + PostgreSQL driver):

```powershell
backend\.venv\Scripts\python -m pip install -r backend\requirements.optional.txt
```

### 2.2 Initialize DB + seed sample frameworks

This creates a local SQLite database and inserts minimal framework sample data.

```powershell
cd E:\Sentinel_GRC
backend\.venv\Scripts\python backend\init_db.py
```

Notes:

- The default DB is SQLite at `sqlite:///./sentinel_grc.db`.
- `backend\init_db.py` recreates the tables (dev/demo behavior).

### 2.3 Run the backend server

```powershell
cd E:\Sentinel_GRC
backend\.venv\Scripts\python backend\run.py
```

Check in browser:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/docs`

## 3) Frontend (React + Vite)

### 3.1 Install dependencies

```powershell
cd E:\Sentinel_GRC
npm.cmd install
```

### 3.2 (Optional) Point frontend to a different backend URL

By default, the frontend calls:

- `http://127.0.0.1:8000/api/v1`

To override, set `VITE_API_URL`:

```powershell
$env:VITE_API_URL="http://127.0.0.1:8000/api/v1"
```

### 3.3 Run the frontend dev server

```powershell
cd E:\Sentinel_GRC
npm.cmd run dev
```

Open:

- `http://127.0.0.1:5173/`

## 4) Login behavior (demo)

- Register a user on `/register`, then login on `/login`.
- Demo auth is stored in browser localStorage.

## 5) Quick functional checks

After both services are running:

- Framework list: `/frameworks`
- Framework tree detail: click any framework
- Risk mapping: `/frameworks/risk-mapping`

## 6) Troubleshooting

### Python not found (Windows)

- Install Python from python.org
- During installation: enable “Add Python to PATH”
- Restart PowerShell/VS Code terminal

### Python opens Microsoft Store / venv fails (Windows execution alias)

If running `python` opens the Microsoft Store or shows an “App execution alias” message:

- Windows Settings → Apps → Advanced app settings → App execution aliases
- Turn OFF: `python.exe` and `python3.exe`
- Restart your terminal and verify:

```powershell
python --version
python -m pip --version
```

### Virtual environment not created / pip not found

Run these commands from the repo root:

```powershell
cd E:\Sentinel_GRC
python -m venv backend\.venv
backend\.venv\Scripts\python -m pip install --upgrade pip
backend\.venv\Scripts\python -m pip install -r backend\requirements.txt
```

### Backend starts then immediately exits

Run with full debug logs:

```powershell
cd E:\Sentinel_GRC
backend\.venv\Scripts\python backend\run.py
```

### pip cannot download packages (Errno 11001 getaddrinfo failed)

This is a DNS/network problem. Fix one of these, then re-run install:

- Connect to the internet (or your campus Wi‑Fi) and disable VPN temporarily
- If you’re behind a proxy, set `HTTPS_PROXY` / `HTTP_PROXY` in PowerShell
- Change your DNS to `8.8.8.8` (Google) or `1.1.1.1` (Cloudflare)

Quick checks:

```powershell
Resolve-DnsName pypi.org
Test-NetConnection pypi.org -Port 443
```

### Port already in use

- Backend uses port 8000
- Frontend uses port 5173

Change ports:

```powershell
backend\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
npm.cmd run dev -- --port 5174
```
