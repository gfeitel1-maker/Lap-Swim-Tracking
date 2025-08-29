# Lap Tracker API — Backend


## Run locally
1. `cp .env.example .env` and fill values.
2. `npm install`
3. `npm run setup-db`
4. `npm run dev`


## Deploy (Railway)
1. Create a new Railway project, add a **PostgreSQL** plugin.
2. Add a **Service → Repo** pointing to `backend/`.
3. Set env vars: `DATABASE_URL` (from plugin), `NODE_ENV=production`, `ADMIN_TOKEN=<choose-one>`, and optionally `CORS_ORIGINS` with your Pages URL: `https://<YOUR-USER>.github.io/<YOUR-REPO>`.
4. Deploy. Your API will be at `https://<your-api>.up.railway.app`.


Dynamic CORS already allows:
- `https://*.github.io`, `https://*.github.dev`
- `https://*.railway.app`, `https://*.onrender.com`
- `https://*.netlify.app`, `https://*.vercel.app`
- `http://localhost:<port>`


## API summary
- `GET /api/health` → `{ ok: true }`
- `GET /api/stats` → totals
- `GET /api/swimmers` → `[ { swimmer_name, total_laps } ]`
- `GET /api/swimmer/:name` → entries + total
- `GET /api/entries?limit=20` → recent entries
- `GET /api/entries/export` → all entries
- `POST /api/entries/add` `{ swimmer_name, laps, date }`
- `POST /api/entries/bulk` `{ entries:[{name|swimmer_name,laps,date}] }` header `x-admin-token: <ADMIN_TOKEN>`
- `DELETE /api/entries/:id` header `x-admin-token`
