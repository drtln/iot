# IoT Website

This adds a minimal Node/Express backend with a SQLite database and a static frontend that shows two fields in a Chart.js line chart.

How to run locally:

1. Install dependencies

   npm install

2. Start server

   npm start

3. Open browser

   http://localhost:3000

API:

- POST /api/data
  - Body: { "field1": number, "field2": number }
  - Adds a reading to the database.

- GET /api/data?limit=200
  - Returns up to `limit` most recent readings (oldest -> newest).

Notes:

- Database file is stored at data/iot.db inside the repo (gitignored). For production use, switch to a managed DB (Postgres, etc.).

