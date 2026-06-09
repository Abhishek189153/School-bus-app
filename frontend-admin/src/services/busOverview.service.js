import api from "../api/axios";

export const getBusOverview =
async () => {

    const response =
        await api.get(
            "/buses/overview"
        );

    return response.data;
};