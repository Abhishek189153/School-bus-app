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

export const
unassignDriverFromBus =
async (busId) => {

    const response =
        await api.put(
            "/assignments/unassign-driver",
            { busId }
        );

    return response.data;
};


export const
unassignRouteFromBus =
async (busId, routeId) => {

    const response =
        await api.put(
            "/assignments/unassign-route",
            { busId, routeId }
        );

    return response.data;
};

export const
getBusesByRoute =
async (routeId) => {

  const response =
    await api.get(
      `/assignments/route-buses/${routeId}`
    );

  return response.data;

};