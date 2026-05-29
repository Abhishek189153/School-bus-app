const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const schoolRoutes = require("./routes/school.routes");
const adminRoutes = require("./routes/admin.routes");



const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("School Bus Management Backend Running");
});

module.exports = app;