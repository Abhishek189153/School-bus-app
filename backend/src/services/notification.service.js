const admin =
require("../config/firebase");

exports.sendPushNotification =
async ({
  token,
  title,
  body,
}) => {

  await admin.messaging().send({
    token,
    notification: {
      title,
      body,
    },
  });
};