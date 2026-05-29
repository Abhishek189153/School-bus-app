import api from "../api/axios";

export const getDrivers = async () => {
  const response = await api.get("/drivers");
  return response.data;
};

export const createDriver = async (data) => {
  const response = await api.post(
    "/drivers",
    data
  );

  return response.data;
};

export const updateDriver = async (
  id,
  data
) => {
  const response = await api.put(
    `/drivers/${id}`,
    data
  );

  return response.data;
};

export const deleteDriver = async (
  id
) => {
  const response = await api.delete(
    `/drivers/${id}`
  );

  return response.data;
};