const Bus = require("../models/bus.model");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Route = require("../models/route.model");
const BusRoute =require("../models/busRoute.model");


exports.assignDriverToBus =
async (req, res) => {

    try {

        const {
            busId,
            driverId,
        } = req.body;

        const bus =
            await Bus.findById(busId);

        const driver =
            await User.findById(driverId);

        if (!bus || !driver) {

            return res.status(404).json({
                success: false,
                message:
                    "Bus or Driver not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });

        }

        if (
            driver.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Driver belongs to another school",
            });

        }

        const existingDriverBus =
            await Bus.findOne({
                driverId,
            });

        if (
            existingDriverBus &&
            existingDriverBus._id.toString() !==
            busId
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Driver is already assigned to another bus",
            });

        }

        if (
            bus.driverId &&
            bus.driverId.toString() !==
            driverId
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Bus already has a driver assigned",
            });

        }

        bus.driverId = driverId;
        await bus.save();

        res.status(200).json({
            success: true,
            bus,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.assignStudentToBus =
async (req, res) => {

    try {

        const {
            studentId,
            busId,
        } = req.body;

        const student =
            await Student.findById(
                studentId
            );

        const bus =
            await Bus.findById(
                busId
            );

        if (!student || !bus) {

            return res.status(404).json({
                success: false,
                message:
                    "Student or Bus not found",
            });

        }

        if (
            student.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Student belongs to another school",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Bus belongs to another school",
            });

        }

        if (
            student.busId &&
            student.busId.toString() !==
            busId
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Student is already assigned to another bus",
            });

        }

        student.busId = busId;

        await student.save();

        res.status(200).json({
            success: true,
            student,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.assignRouteToBus = async (req, res) => {
  try {
    const {
      busId,
      routeId,
    } = req.body;

    // ==========================================
    // FIND BUS
    // ==========================================

    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // ==========================================
    // FIND ROUTE
    // ==========================================

    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // ==========================================
    // CHECK BUS SCHOOL
    // ==========================================

    if (
      bus.schoolId.toString() !==
      req.user.schoolId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bus belongs to another school",
      });
    }

    // ==========================================
    // CHECK ROUTE SCHOOL
    // ==========================================

    if (
      route.schoolId.toString() !==
      req.user.schoolId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Route belongs to another school",
      });
    }

    // ==========================================
    // CHECK 1
    // ROUTE ALREADY EXISTS AS PRIMARY ROUTE
    // ==========================================

    const primaryRouteBus = await Bus.findOne({
      schoolId: req.user.schoolId,
      routeId: routeId,
    });

    if (primaryRouteBus) {
      return res.status(400).json({
        success: false,
        message:
          "This route is already assigned to another bus. Create a separate route for the other bus.",
      });
    }

    // ==========================================
    // CHECK 2
    // ROUTE ALREADY EXISTS IN BUSROUTE
    // ==========================================

    const existingRoute = await BusRoute.findOne({
      routeId: routeId,
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message:
          "This route is already assigned to another bus. Create a separate route for the other bus.",
      });
    }

    // ==========================================
    // ASSIGN ROUTE
    // ==========================================

    // First route → Primary Route
    if (!bus.routeId) {
      bus.routeId = routeId;

      await bus.save();
    }

    // Additional route → BusRoute
    else {
      await BusRoute.create({
        busId: busId,
        routeId: routeId,
      });
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Route assigned successfully",
    });

  } catch (error) {

    console.error(
      "assignRouteToBus ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.unassignDriverFromBus =
async (req, res) => {

    try {

        const { busId } =
            req.body;

        const bus =
            await Bus.findById(
                busId
            );

        if (!bus) {

            return res.status(404).json({
                success: false,
                message:
                    "Bus not found",
            });

        }

        if (
            bus.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "Access denied",
            });

        }

        bus.driverId = null;

        await bus.save();

        res.status(200).json({
            success: true,
            message:
                "Driver unassigned successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }
};


exports.unassignRouteFromBus =
async (req, res) => {

    try {

        const {
            busId,
            routeId,
        } = req.body;

        const bus =
            await Bus.findById(
                busId
            );

        if (!bus) {

            return res.status(404).json({
                success: false,
                message:
                    "Bus not found",
            });

        }

        // Primary Route
        if (
            bus.routeId &&
            bus.routeId.toString() ===
            routeId
        ) {

            bus.routeId = null;

            await bus.save();

        } else {

            await BusRoute.findOneAndDelete({
                busId,
                routeId,
            });

        }

        res.status(200).json({
            success: true,
            message:
                "Route unassigned successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message,
        });

    }
};

exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const schoolId = req.user.schoolId;

    // ==========================================
    // 1. FIND BUSES WHERE THIS IS THE PRIMARY ROUTE
    // ==========================================
    const primaryBuses = await Bus.find({
      routeId,
      schoolId,
    });

    // ==========================================
    // 2. FIND BUSES WHERE THIS IS AN ADDITIONAL ROUTE
    // ==========================================
    const assignments = await BusRoute.find({
      routeId,
    }).populate("busId");

    const additionalBuses = assignments
      .map((assignment) => assignment.busId)
      .filter(Boolean)
      .filter(
        (bus) =>
          bus.schoolId?.toString() ===
          schoolId.toString()
      );

    // ==========================================
    // 3. COMBINE BOTH
    // ==========================================
    const allBuses = [
      ...primaryBuses,
      ...additionalBuses,
    ];

    // ==========================================
    // 4. REMOVE DUPLICATE BUSES
    // ==========================================
    const uniqueBuses = Array.from(
      new Map(
        allBuses.map((bus) => [
          bus._id.toString(),
          bus,
        ])
      ).values()
    );

    res.status(200).json({
      success: true,
      buses: uniqueBuses,
    });

  } catch (error) {
    console.error(
      "GET BUSES BY ROUTE ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};