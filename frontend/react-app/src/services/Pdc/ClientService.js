import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const getClients = () => {
    
    return useQuery('clients', async () => {
        const { data } = await Http.get(`/api/client/get-client`);

        return data;
    })

}

const getClientsForSelect = () => {
    
    return useQuery('clients-select-input', async () => {
        const { data } = await Http.get(`/api/client/get-client`);

        return data.map(row => {
            return {
                label: `${row.first_name} ${row.last_name}`,
                value: row.id
            }
        });
    })

}

const createClients = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/create', formData)
    });
    
}

const createClientsProperty = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/create-client-property', formData)
    });
    
}

const createClientsBank = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/create-client-bank', formData)
    });
    
}

const getClientBank = () => {
    
    return useQuery('clients-bank', async () => {
        const { data } = await Http.get(`/api/client/get-client-bank`);

        return data;
    })

}

const updateClientsBank = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/update-client-bank', formData)
    });
    
}

const removeClientsBank = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/remove-client-bank', formData)
    });
    
}

const updateClients = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/update', formData)
    });
    
}

const removeClients = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/remove', formData)
    });
    
}

const createClientsPdc = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/create-client-pdc', formData)
    });
    
}

const updateClientsPdc = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/update-client-pdc', formData)
    });
    
}

const removeClientsPdc = () => {

    return useMutation(async formData => {
        return await Http.post('/api/client/remove-client-pdc', formData)
    });
    
}

export default {
    getClients,
    createClients,
    createClientsProperty,
    createClientsBank,
    getClientBank,
    getClientsForSelect,
    updateClients,
    removeClients,
    updateClientsBank,
    removeClientsBank,
    createClientsPdc,
    updateClientsPdc,
    removeClientsPdc
}