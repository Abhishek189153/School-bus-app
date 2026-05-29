const Notification =
require("../models/notification.model");

exports.createNotification =
async ({
  schoolId,
  recipientId,
  title,
  message,
  type,
}) => {

  return await Notification.create({
    schoolId,
    recipientId,
    title,
    message,
    type,
  });
};