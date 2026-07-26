const Holiday = require("../models/holiday.model");

// Add Holiday
exports.createHoliday = async (req, res) => {
  try {

    const { date, title } = req.body;

    const schoolId = req.user.schoolId;

    const exists = await Holiday.findOne({
      schoolId,
      date,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists for this date.",
      });
    }

    const holiday = await Holiday.create({
      schoolId,
      date,
      title,
    });

    res.status(201).json({
      success: true,
      message: "Holiday added successfully.",
      holiday,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Get Holidays
exports.getHolidays = async (req, res) => {

  try {

    const holidays = await Holiday.find({
      schoolId: req.user.schoolId,
    }).sort({
      date: 1,
    });

    res.json({
      success: true,
      holidays,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// Delete Holiday
exports.deleteHoliday = async (req, res) => {

  try {

    await Holiday.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Holiday deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};