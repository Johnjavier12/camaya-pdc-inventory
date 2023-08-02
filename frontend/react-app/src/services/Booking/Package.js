import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'


const list = (isAuthenticated) => {

    let url = '/api/booking/public/packages';

    if (isAuthenticated) {
        url = '/api/booking/packages';
    }

    return useQuery("packages", async () => {
        const { data } = await Http.get(url);
        return data;
    });

}

export default {
    list,
}