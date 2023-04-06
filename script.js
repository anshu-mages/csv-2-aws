const mysql = require("mysql2/promise");
const csv = require("csv-parser");
const fs = require("fs");
require("dotenv").config();

const DB_HOST = "mydb.csiklziovxzv.us-east-1.rds.amazonaws.com";
const DB_USER = "admin";
const DB_PASSWORD = "password";
const DB_NAME = "test";

const fileName = process.argv[2];
const tableName = process.argv[3];

if (!fileName) {
  console.error(
    "File name is missing. Please provide a file name as the first argument."
  );
  process.exit(1);
}

if (!tableName) {
  console.error(
    "Table name is missing. Please provide a table name as the second argument."
  );
  process.exit(1);
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const failedRows = [];

let counter = 1;

fs.createReadStream(fileName)
  .pipe(csv())
  .on("data", async (row) => {
    // Validate email field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) {
      console.error(`Invalid email format in record ${counter}: ${row.email}`);
      failedRows.push(row);
      return;
    }

    // Check for empty fields
    for (const key in row) {
      if (row.hasOwnProperty(key) && !row[key]) {
        console.error(`Empty field found in record ${counter}: ${key}`);
        failedRows.push(row);
        return;
      }
    }

    try {
      const conn = await pool.getConnection();
      await conn.query(`INSERT INTO ${tableName} SET ?`, row);
      conn.release();
    } catch (err) {
      console.error(err);
      failedRows.push(row);
    }
    counter++;
  })
  .on("end", () => {
    console.log("CSV file successfully uploaded to AWS RDS!");

    if (failedRows.length > 0) {
      const fields = Object.keys(failedRows[0]);
      const csvData = failedRows.map((row) =>
        fields.map((field) => row[field]).join(",")
      );
      const csvContent = `${fields.join(",")}\n${csvData.join("\n")}`;

      fs.writeFile(`${tableName}_failed_rows.csv`, csvContent, (err) => {
        if (err) {
          console.error(`Error writing failed rows to CSV: ${err}`);
        } else {
          console.log(`Failed rows saved to ${tableName}_failed_rows.csv`);
        }
      });
    }
  });
