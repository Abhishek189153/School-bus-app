import api from "../api/axios";

export const loginUser = async (
  credentials
) => {

  const response =
    await api.post(
      "/auth/login",
      credentials
    );

  return response.data;
};

export const changePassword = async (newPassword) => {

    const response = await api.put(

        "/auth/change-password",

        {
            newPassword,
        }

    );

    return response.data;

};

export const forgotPassword = async (phone) => {

    const response = await api.post(

        "/auth/forgot-password",

        {

            phone,

        }

    );

    return response.data;

};


export const verifyOtp = async (

    phone,

    otp

) => {

    const response = await api.post(

        "/auth/verify-otp",

        {

            phone,

            otp,

        }

    );

    return response.data;

};

export const generateTemporaryPassword = async (

    phone

) => {

    const response = await api.post(

        "/auth/generate-temp-password",

        {

            phone,

        }

    );

    return response.data;

};