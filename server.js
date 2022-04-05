const app = require('./app.js');
const http = require('http');
const server = http.createServer(app);
const database = require('./src/databases/postgres/postgres');
const dotenv = require('dotenv').config({ path: './secret/config.env' });
const port = process.env.PORT;

function startServer(instance) {
  database('postgres');
  instance.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer(server);
