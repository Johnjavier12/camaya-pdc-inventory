import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'

const filterPdcReport = () => {

    return useMutation(async formData => {
        return await Http.post('/api/pdc-report/filter-report', formData)
    });
    
}

const downloadReport = (formData) => {

    Http.post('/api/pdc-report/filter-report-download',formData,{responseType: 'blob'}).then(({data}) => {

            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');

            const now = new Date().toLocaleDateString();

            link.href = downloadUrl;
            link.setAttribute('download', `pdc-report-${now}.xlsx`); 
            document.body.appendChild(link);
            link.click();
            link.remove();

    });

}

export default {
    filterPdcReport,
    downloadReport
}