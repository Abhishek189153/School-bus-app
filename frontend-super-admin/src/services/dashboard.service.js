import axios from "../api/axios";

export const getDashboard = async (page = 1, limit = 5) => {
  const res = await axios.get(
    `/admin/dashboard?page=${page}&limit=${limit}`
  );

  return res.data;
};