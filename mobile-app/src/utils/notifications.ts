import * as Notifications
from "expo-notifications";

Notifications.setNotificationHandler({

  handleNotification:
    async () => ({

      shouldShowBanner: true,

      shouldShowList: true,

      shouldPlaySound: true,

      shouldSetBadge: false,

    }),

});

export const
registerForPushNotifications =
async () => {

  try {

    const permission =

      await Notifications
        .requestPermissionsAsync();

    console.log(
      "PERMISSION:",
      permission
    );

    if (
      permission.status !==
      "granted"
    ) {

      console.log(
        "NOTIFICATION PERMISSION DENIED"
      );

      return null;

    }

    const token =
  await Notifications
    .getExpoPushTokenAsync({

      projectId:
        "16d6f39d-2c6f-4e9a-9756-4572f1c04a43",

    });
    console.log(
      "TOKEN RESPONSE:",
      token
    );

    return token.data;

  } catch (error) {

    console.log(
      "NOTIFICATION ERROR:",
      error
    );

    return null;

  }

};