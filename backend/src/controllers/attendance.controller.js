const Attendance = require("../models/attendance.model");

exports.dutyOn = async (req, res) => {
  try {

    const attendance = await Attendance.create({
      driverId: req.user.id,
      schoolId: req.user.schoolId,
      dutyOnTime: new Date(),
      status: "ON_DUTY",
    });

    res.status(201).json({
      success: true,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.dutyOff = async (req, res) => {

  try {

    const attendance = await Attendance.findOne({
      driverId: req.user.id,
      status: "ON_DUTY",
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "No active duty found",
      });
    }

    attendance.dutyOffTime = new Date();
    attendance.status = "OFF_DUTY";

    await attendance.save();

    res.status(200).json({
      success: true,
      attendance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};