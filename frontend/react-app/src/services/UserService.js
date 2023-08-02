import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const list = () => {

        return useQuery("users", async () => {
            const { data } = await Http.get(`/api/admin/users`);
            return data;
        });

}

const create = () => {

        return useMutation(async formData => {
            return await Http.post('/api/admin/create', formData)
        });

}

// const item = (id) => {
//     return useQuery(["payment", id], async () => {
//             const { data } = await Http.get(`/api/payment/${id}`);
//             return data;
//         }, {
//             enabled: id,
//         });
// }

export default {
    list,
    create,
    // item
}