import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const list = (isAuthenticated) => {

    let url = '/api/booking/public/products';

    if (isAuthenticated) {
        url = '/api/booking/products';
    }

    return useQuery("products", async () => {
        const { data } = await Http.get(url);
        return data;
    });

}

export default {
    list,
}