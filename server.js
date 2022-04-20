require('dotenv').config();
const app = require('./app.js');
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT;

// MAKE THIS BECAUSE OF PM2 ECOSYSTEM
function startServer(instance) {
   instance.listen(8000, () => {
      console.log(`Server running on port ${8000}`);
   });
}

startServer(server);

// console.log(process.env.PRISMA_CONNECT_STRING_LOCAL);
