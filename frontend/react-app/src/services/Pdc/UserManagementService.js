import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

import axios from 'axios';

const getUsers = () => {
    return useQuery("users", async () => {
        const { data } = await Http.get(`/api/get-users`);
        return data;
    });
}

const getUserRole = () => {
    return useQuery("users-role", async () => {
        const { data } = await Http.get(`/api/get-user-role`);

        return data.map(row => {
            return {
                value: row.id,
                label: row.name
            }
        });
    });
}

const getUserRoleForTable = () => {
    return useQuery("users-role-table", async () => {
        const { data } = await Http.get(`/api/get-user-role`);

        return data;
    });
}

const createUserAccount = () => {

    return useMutation(async formData => {
        return await Http.post('/api/register', formData)
    });

}

const updateUserAccount = () => {

    return useMutation(async formData => {
        return await Http.post('/api/update-user-account', formData)
    });

}

const removeUserAccount = () => {

    return useMutation(async formData => {
        return await Http.post('/api/remove-user-account', formData)
    });

}

const updateUserPassword = () => {

    return useMutation(async formData => {
        return await Http.post('/api/update-password', formData)
    });

}

const createRole = () => {

    return useMutation(async formData => {
        return await Http.post('/api/create-user-role', formData)
    });

}

const updateRole = () => {

    return useMutation(async formData => {
        return await Http.post('/api/update-user-role', formData)
    });

}

const removedRole = () => {

    return useMutation(async formData => {
        return await Http.post('/api/remove-user-role', formData)
    });

}

const getPermissions = () => {
    return useMutation(async formData => {
        return await Http.post(`/api/permissions-by-module`, formData)
    });
}


export default {
    getPermissions,
    getUsers,
    createUserAccount,
    getUserRole,
    updateUserAccount,
    removeUserAccount,
    updateUserPassword,
    createRole,
    updateRole,
    removedRole,
    getUserRoleForTable
}