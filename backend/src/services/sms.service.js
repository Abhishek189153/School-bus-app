const axios = require("axios");

exports.sendOTP = async (
  phone,
  otp
) => {

  try {

    const response =
      await axios.get(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          params: {
            authorization:
              process.env.FAST2SMS_API_KEY,
            route: "otp",
            variables_values: otp,
            numbers: phone,
          },
        }
      );

    console.log(
      "SMS RESPONSE:",
      response.data
    );

    return true;

  } catch (error) {

    console.log(
      "SMS ERROR:",
      error.response?.data ||
      error.message
    );

    return false;

  }

};