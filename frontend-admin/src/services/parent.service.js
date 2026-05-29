import api from "../api/axios";

export const getParents = async () => {
  const response = await api.get("/parents");
  return response.data;
};

export const createParent = async (data) => {
  const response = await api.post(
    "/parents",
    data
  );

  return response.data;
};

export const updateParent = async (
  id,
  data
) => {
  const response = await api.put(
    `/parents/${id}`,
    data
  );

  return response.data;
};

export const deleteParent = async (
  id
) => {
  const response = await api.delete(
    `/parents/${id}`
  );

  return response.data;
};