let locationSubscription:
  any = null;

export const
setLocationSubscription =
(
  subscription: any
) => {

  locationSubscription =
    subscription;

};

export const
stopLocationTracking =
() => {

  if (
    locationSubscription
  ) {

    locationSubscription.remove();

    locationSubscription =
      null;

    console.log(
      "GPS Tracking Stopped"
    );

  }

};