import api from "../api/axios";

export const getWorkingDays = async () => {

    const { data } =
    await api.get("/working-days");

    return data;

};

export const updateWorkingDays = async (payload) => {

    const { data } =
    await api.put(
        "/working-days",
        payload
    );

    return data;

};