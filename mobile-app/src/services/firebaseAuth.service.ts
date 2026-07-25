import auth from "@react-native-firebase/auth";

export const sendFirebaseOTP = async (
  phoneNumber: string
) => {
  return await auth().signInWithPhoneNumber(
    `+91${phoneNumber}`
  );
};