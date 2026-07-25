import axios from "../api/axios";

export const getDashboard = async () => {

    const res = await axios.get("/admin/dashboard");

    return res.data;

};