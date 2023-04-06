# Title: Upload CSV to AWS MySQL

This is a simple script to upload a CSV file to AWS MySQL.

## Setup the Script to Run
1. Install Node.js
2. Install the dependencies: `npm install`
3. Create a `.env` file in the root directory
4. Add the following to the `.env` file:


## How to Use the Script
1. Create a CSV file with the data you want to upload.
2. Run the script with the following command:

For example, to upload a CSV file called `players.csv` to a table called `players`, you would run:

3. The script will validate the CSV file and insert the data into the specified table in your AWS MySQL database.
4. If any rows fail validation or insertion, the script will create a new CSV file called `<table name>_failed_rows.csv` in the same directory as the original CSV file. This file will contain the rows that failed along with the reason for failure.

## Additional Features
- The script checks for empty fields and invalid email formats and excludes those rows from insertion.
- The `last-active-at` field is formatted as a string before insertion.
- The script logs errors to the console for debugging purposes.
- The script uses the `mysql2` library for database connectivity, which provides improved performance and security over the standard `mysql` library.
- The `dotenv` library is used to securely manage database credentials.
- The script includes clear instructions for setup and use.
