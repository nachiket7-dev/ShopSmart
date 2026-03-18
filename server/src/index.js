require('dotenv').config();
const app = require('./app');

let port = parseInt(process.env.PORT) || 5001;

function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      port += 1;
      startServer();
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
