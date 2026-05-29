import api from "../api/axios";

export const getBuses = async () => {
  const response = await api.get("/buses");
  return response.data;
};