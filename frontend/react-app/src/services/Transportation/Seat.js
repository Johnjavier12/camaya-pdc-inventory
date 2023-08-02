import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const create = () => {

        return useMutation(async formData => {
            try {
                return await Http.post('/api/transportation/seat/create', formData);
            } catch (error) {
                return Promise.reject(error);
            }
        });

}

const list = () => {

    return useQuery("seats", async () => {
        const { data } = await Http.get(`/api/transportation/seats`);
        return data;
    });

}

export default {
    create,
    list,
}