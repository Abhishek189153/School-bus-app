const Boarding =
require("../models/boarding.model");

exports.markBoarding =
async (req, res) => {

  try {

    const {
      tripId,
      studentId
    } = req.body;

    const boarding =
      await Boarding.create({
        tripId,
        studentId,
      });

    res.status(201).json({
      success: true,
      boarding,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};