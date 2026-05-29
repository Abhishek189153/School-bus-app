import api from "../api/axios";

export const assignDriverToBus =
  async (data) => {

    const response =
      await api.put(
        "/assignments/assign-driver",
        data
      );

    return response.data;
};

export const assignRouteToBus =
  async (data) => {

    const response =
      await api.put(
        "/assignments/assign-route",
        data
      );

    return response.data;
};

export const assignStudentToBus =
  async (data) => {

    const response =
      await api.put(
        "/assignments/assign-student",
        data
      );

    return response.data;
};