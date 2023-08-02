import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const getPhase = () => {
    return useQuery('phase', async () => {
        const { data } = await Http.get(`/api/phase/get-phase`);
        return data;
    });
}

const getPhaseForSelect = () => {
    return useQuery('phase-new-data', async () => {
        const { data } = await Http.get(`/api/phase/get-phase`);
        
        return data.map(row => {
            return {
                label: row.phase_name,
                value: row.id
            }
        });
    });
}

const getPhaseProperty = (phase_id) => {
    return useQuery('phase-property', async () => {
        const { data } = await Http.get(`/api/phase/get-phase-property/${phase_id}`);

        return data.map(row => {
            return {
                label: `Blk ${row.block_number} - lot ${row.block_lot_number}`,
                value: row.id
            }
        });
    });
}

const createPhase = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/create', formData)
    });

}

const updatePhase = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/update', formData)
    });

}

const removePhase = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/remove', formData)
    });

}

const createPhaseProperty = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/create-phase-property', formData)
    });

}

const updatePhaseProperty = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/update-phase-property', formData)
    });

}

const deletePhaseProperty = () => {

    return useMutation(async formData => {
        return await Http.post('/api/phase/delete-phase-property', formData)
    });

}

export default {
    getPhase,
    getPhaseProperty,
    createPhase,
    createPhaseProperty,
    getPhaseForSelect,
    updatePhase,
    removePhase,
    updatePhaseProperty,
    deletePhaseProperty
}