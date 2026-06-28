const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'iot.db');
const fs = require('fs');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('Failed to open DB', err);
  console.log('Opened SQLite DB at', DB_PATH);
});

// Initialize table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field1 REAL NOT NULL,
      field2 REAL NOT NULL,
      ts DATETIME DEFAULT (datetime('now'))
    )`
  );
});

function insertReading(field1, field2) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO readings (field1, field2) VALUES (?, ?)');
    stmt.run([field1, field2], function (err) {
      stmt.finalize();
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getRecentReadings(limit = 500) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, field1, field2, ts FROM readings ORDER BY id DESC LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) return reject(err);
        // return ascending by id (oldest -> newest)
        resolve(rows.reverse());
      }
    );
  });
}

module.exports = {
  insertReading,
  getRecentReadings,
  _db: db,
};
