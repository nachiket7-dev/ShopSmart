require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

let port = process.env.PORT || 3000;

// Connect to MongoDB, then start the server
connectDB().then(() => {
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
});
