require('dotenv').config();
const app = require('./app.js');
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 5000;

function startServer(instance) {
  instance.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer(server);
// require('./public/images/users')
