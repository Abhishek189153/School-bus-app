import api
from "../api/axios";

export const
getDriverAttendanceHistory =
async (
  date,
  busId,
  search
) => {

  const response =
    await api.get(
      "/attendance/driver-history",
      {
        params: {
          date,
          busId,
          search,
        },
      }
    );

  return response.data;

};