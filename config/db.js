// const sqlite3 = require('sqlite3').verbose();

// // Create or connect to the SQLite database file
// const db = new sqlite3.Database('./peta.sqlite', (err) => {
//   if (err) {
//     console.error('Error connecting to the SQLite database:', err.message);
//     throw err;
//   }
//   console.log('Connected to the SQLite database!');
// });

// // Export the database connection
// module.exports = db;

// Open a SQLite database connection
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./peta.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err.message);
    throw err;
  }
  console.log('Connected to the SQLite database!');
});

const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    if (sql.trim().toLowerCase().startsWith('select')) {
      db.all(sql, values, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    } else {
      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    }
  });
};

export default query;