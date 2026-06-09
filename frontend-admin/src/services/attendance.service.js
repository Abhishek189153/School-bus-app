import api from "../api/axios";

export const
getAttendanceHistory =
async (
  date,
  busId,
  routeId,
  search,
  tripType
) => {

  const response =
    await api.get(
      "/attendance/history",
      {
        params: {
          date,
          busId,
          routeId,
          search,
          tripType
        },
      }
    );

  return response.data;
};