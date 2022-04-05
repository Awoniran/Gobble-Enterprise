const { Client } = require('pg');

function connectDB(DBname) {
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: DBname,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  });
  client.connect(function (err) {
    if (err) throw err.message;
    console.log('pg Database Connected successfully !!!');
  });
}
module.exports = connectDB;
