const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const schoolRoutes = require("./routes/school.routes");
const adminRoutes = require("./routes/admin.routes");
const driverRoutes = require("./routes/driver.routes");
const parentRoutes = require("./routes/parent.routes");
const studentRoutes = require("./routes/student.routes");
const busRoutes = require("./routes/bus.routes");
const routeRoutes = require("./routes/route.routes");
const assignmentRoutes = require("./routes/assignment.routes");



const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/assignments", assignmentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("School Bus Management Backend Running");
});

module.exports = app;