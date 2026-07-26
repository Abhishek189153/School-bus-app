import api from "../api/axios";

export const getHolidays = async () => {
  const res = await api.get("/holiday");
  return res.data;
};

export const createHoliday = async (data) => {
  const res = await api.post("/holiday", data);
  return res.data;
};

export const deleteHoliday = async (id) => {
  const res = await api.delete(`/holiday/${id}`);
  return res.data;
};