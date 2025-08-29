# 🏊‍♀️ Pozez JCC Community Lap Tracker — Frontend


Runs on GitHub Pages. Works in two modes:


- **Local Mode (default):** stores data in `localStorage`.
- **API Mode:** set an API base URL to use your Express/Postgres backend.


## Deploy to GitHub Pages
1. Push `frontend/` to a GitHub repo.
2. Enable **Settings → Pages → Deploy from a branch** and set the folder to `frontend/`.
3. Your Pages URL will be `https://<YOUR-USER>.github.io/<YOUR-REPO>/`.


## Connect to the API
- In the page UI, set the **API Base URL** (e.g., `https://<your-api>.up.railway.app`).
- Or add `?api=https://<your-api>.up.railway.app` to the URL.


## Export/Import
- **Export JSON:** downloads all data (local or API).
- **Import JSON:**
- Local Mode → writes to browser storage.
- API Mode → prompts for admin token and bulk inserts on the server.
