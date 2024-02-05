const mysql = require("mysql");

function useDatabase(query, values) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "notes_app",
    });

    connection.connect();

    connection.query(query, values, (err, rows, fields) => {
      if (err) {
        connection.end();
        reject(err);
      } else {
        connection.end();
        resolve(rows);
      }
    });
  });
}

module.exports = { useDatabase };
