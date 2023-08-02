import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const getPermissions = () => {
    
    return useQuery('permissions', async () => {
        const { data } = await Http.get(`/api/permission`);

        return data;
    })

}

const createPermissions = () => {

    return useMutation(async formData => {
        return await Http.post('/api/permission', formData)
    });
    
}



const getPermission = () => {
    
    return useQuery('show-permission', async () => {
        const { data } = await Http.get(`/api/client/get-client-bank`);

        return data;
    })

}

const updatePermission = () => {

    return useMutation(async formData => {
        return await Http.post('/api/permission', formData)
    });
    
}

const deletePermission = () => {

    return useMutation(async formData => {
        return await Http.post('/api/permission', formData)
    });
    
}

const assignPermissionToRole = () => {
    return useMutation(async formData => {
        return await Http.post('/api/role/assign', formData)
    });
}

const unassignPermissionFromRole = () => {
    return useMutation(async formData => {
        return await Http.post('/api/role/unassign', formData)
    });
}


export default {
    getPermission,
    deletePermission,
    getPermissions,
    updatePermission,
    createPermissions,
    unassignPermissionFromRole,
    assignPermissionToRole,
}