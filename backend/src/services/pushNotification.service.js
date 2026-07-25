const {
  Expo,
} = require(
  "expo-server-sdk"
);


const expo =
  new Expo();

exports.sendNotification =
async (

  pushToken,

  title,

  body

) => {

  if (
    !Expo.isExpoPushToken(
      pushToken
    )
  ) {

    return;

  }


  
  const result =
  await expo.sendPushNotificationsAsync([
    {
      to: pushToken,
      sound: "default",
      title,
      body,
    },
  ]);

console.log(
  "EXPO RESPONSE:",
  JSON.stringify(
    result,
    null,
    2
  )
);

};