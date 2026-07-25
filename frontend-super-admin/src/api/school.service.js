import api from "./axios";

export const getSchools = () =>
    api.get("/schools");

export const createSchool = (data) =>
    api.post("/schools", data);

export const updateSchool = (id, data) =>
    api.put(`/schools/${id}`, data);

export const deleteSchool = (id) =>
    api.delete(`/schools/${id}`);