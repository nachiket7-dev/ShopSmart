const mongoose = require('mongoose');

// Disable Mongoose buffering in tests so operations fail immediately
// instead of hanging forever when no database is connected.
mongoose.set('bufferCommands', false);

// Set a very short connection timeout so Mongoose gives up quickly
mongoose.set('bufferTimeoutMS', 500);
