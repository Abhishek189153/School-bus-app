const User =
require("../models/user.model");

exports.saveFcmToken =
async (req, res) => {

  try {

    const { fcmToken } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      { fcmToken }
    );

    res.json({
      success: true,
      message: "Token saved",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};