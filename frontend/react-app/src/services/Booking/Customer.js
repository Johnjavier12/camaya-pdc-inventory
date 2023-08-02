import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const create = () => {

        return useMutation(async formData => {
            return await Http.post('/api/booking/customer/create', formData)
        });

}

const list = () => {

    return useQuery("customers", async () => {
        const { data } = await Http.get(`/api/booking/customers`);
        return data;
    });

}

export default {
    create,
    list,
}