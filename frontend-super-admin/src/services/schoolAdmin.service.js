import api from "../api/axios";

export const getSchoolAdmins = async () => {

    const response = await api.get(
        "/admin/school-admins"
    );

    return response.data.admins;

};

export const createSchoolAdmin = async (data) => {

    const response = await api.post(
        "/admin/school-admin",
        data
    );

    return response.data;

};

export const getSchoolAdmin = async (id) => {

    const response = await api.get(
        `/admin/school-admin/${id}`
    );

    return response.data.admin;

};

export const updateSchoolAdmin = async (
    id,
    data
) => {

    const response = await api.put(
        `/admin/school-admin/${id}`,
        data
    );

    return response.data;

};

export const deleteSchoolAdmin = async (id) => {

    const response = await api.delete(
        `/admin/school-admin/${id}`
    );

    return response.data;

};