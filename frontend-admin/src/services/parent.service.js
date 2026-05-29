import api from "../api/axios";

export const getParents = async () => {
  const response = await api.get("/parents");
  return response.data;
};