import axios from "../api/axios";

export const getDashboard = async (
  page = 1,
  limit = 5,
  search = ""
) => {
  const res = await axios.get("/admin/dashboard", {
    params: {
      page,
      limit,
      search,
    },
  });

  return res.data;
};