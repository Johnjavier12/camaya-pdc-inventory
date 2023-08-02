import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'


const list = (date) => {

    return useQuery("schedules", async () => {
        const { data } = await Http.get(`/api/transportation/schedules?date=${date}`);
        return data;
    });

}


export default {
    list,
}