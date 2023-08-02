import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'


const salesDownload = (start_date, end_date) => {

    Http.get(`/api/one-bits/reports/1bits-sales-report/${start_date}/${end_date}/download`, {responseType: 'blob'}).then(({data}) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `Sales-Manifest-${start_date}-${end_date}.xlsx`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
    });

}

const getSales = (start_date, end_date) => {    
    
    return useQuery(['reports', '1bits-sales-report', start_date, end_date], async () => {  
        if (! start_date || ! end_date) return [];
        
        const { data } = await Http.get(`/api/one-bits/reports/1bits-sales-report/${start_date}/${end_date}`);
        console.log(data);
        return data.data;
    },{
        refetchOnWindowFocus: false,
    });

}

export default{
    salesDownload,
    getSales,
}

