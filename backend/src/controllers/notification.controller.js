const User =require("../models/user.model");
const Notification = require("../models/notification.model");

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


exports.getMyNotifications = async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        recipientId: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};