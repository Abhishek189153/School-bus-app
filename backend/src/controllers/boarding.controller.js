const Boarding = require("../models/boarding.model");

const Student =require("../models/student.model");

const User =require("../models/user.model");

const {createNotification,} = require("../services/inAppNotification.service");

const {sendPushNotification,} = require("../services/notification.service");

exports.markBoarding = async (req, res) => {

  try {

    const {
      tripId,
      studentId,
    } = req.body;

    const alreadyBoarded =
      await Boarding.findOne({
        tripId,
        studentId,
      });

    if (alreadyBoarded) {
      return res.status(400).json({
        success: false,
        message:
          "Student already boarded",
      });
    }

    const boarding =
      await Boarding.create({
        tripId,
        studentId,
      });

    const student =
      await Student.findById(
        studentId
      );

    const parent =
      await User.findById(
        student.parentId
      );

    await createNotification({
      schoolId: student.schoolId,
      recipientId: parent._id,
      title: "Student Boarded",
      message:
        `${student.name} has boarded the bus.`,
      type: "BOARDING",
    });

    if (parent?.fcmToken) {

      await sendPushNotification({
        token: parent.fcmToken,
        title: "Student Boarded",
        body:
          `${student.name} has boarded the bus.`,
      });

    }

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