const Student = require("../models/student.model");
const User = require("../models/user.model");

const {
  createNotification,
} = require("../services/inAppNotification.service");

const {
  sendPushNotification,
} = require("../services/notification.service");

exports.sendBusAlert = async (req, res) => {
  try {

    const {
      busId,
      title,
      message,
      type,
    } = req.body;

    const students = await Student.find({
      busId,
    });

    for (const student of students) {

      const parent =
        await User.findById(
          student.parentId
        );

      await createNotification({
        schoolId: student.schoolId,
        recipientId: parent._id,
        title,
        message,
        type,
      });

      if (parent?.fcmToken) {

        await sendPushNotification({
          token: parent.fcmToken,
          title,
          body: message,
        });

      }
    }

    res.status(200).json({
      success: true,
      message: "Alert sent successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};