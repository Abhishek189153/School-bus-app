const BASE_URL =
  "http://192.168.1.7:5000/api/auth";

export const loginUser = async (
  phone,
  password
) => {

  const response =
    await fetch(
      `${BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      }
    );

  const data =
    await response.json();

  return data;
};