import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const getDailyChecks = async () => {

    const { data } = await Http.get(`/api/dashboard/daily-checks`);

    return data;
}

const updatePdcStatus = () => {

    return useMutation(async formData => {
        return await Http.post('/api/pdc/update-pdc-status', formData)
    });
    
}

const updatePdcStatusMultiple = () => {

    return useMutation(async formData => {
        return await Http.post('/api/pdc/update-pdc-status-multiple', formData)
    });
    
}

const filterDailyChecks = () => {

    return useMutation(async formData => {
        return await Http.post('/api/dashboard/daily-checks-filter', formData)
    });
    
}

const downloadDailyChecks = (formData) => {

    Http.post('/api/dashboard/daily-checks-download',formData,{responseType: 'blob'}).then(({data}) => {

            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');

            const now = new Date().toLocaleDateString();

            link.href = downloadUrl;
            link.setAttribute('download', `daily-checks-${now}.xlsx`); 
            document.body.appendChild(link);
            link.click();
            link.remove();

    });

}

const getPdcAmountLocation = async () => {

    const { data } = await Http.get(`/api/dashboard/pdc-amount-location`);

    return data;
}

const getPdcYearly = async (year) => {

    const { data } = await Http.get(`/api/dashboard/pdc-yearly-pdc/${year}`);

    return data;
}

export default {
    getDailyChecks,
    updatePdcStatus,
    updatePdcStatusMultiple,
    filterDailyChecks,
    downloadDailyChecks,
    getPdcAmountLocation,
    getPdcYearly
}