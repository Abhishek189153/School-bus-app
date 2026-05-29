require("dotenv").config();

const http = require("http");

const app = require("./app");

const connectDB = require("./config/db");


const {
  initializeSocket,
} = require("./sockets/socket");


// Database Connection
connectDB();


// Create Server
const server = http.createServer(app);


initializeSocket(server);

// PORT
const PORT = process.env.PORT || 5000;


// Start Server
server.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});