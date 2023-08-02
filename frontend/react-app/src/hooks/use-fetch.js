import { useState, useEffect, useCallback } from 'react'
import Http from 'utils/Http'

const useFetch = (url) => {
    
    const [fetchedData, setFetchedData] = useState({
        data: [],
        isLoading: true,
        error: false,
    })

    const cancelTokenSource = Http.CancelToken.source();
    const fetchData = useCallback( async() => {
        try {
            const response = await Http.get(url, { cancelToken: cancelTokenSource.token });
            const data = await response.data;

            if (data) {
                setFetchedData({
                    data: data,
                    isLoading: false,
                    error: false,
                })
            }
        } catch (e) {
            if (Http.isCancel(e)) {
                console.log("fetching data aborted");
            } else {
                console.log("error occured", e);
            }

            setFetchedData({
                data: [],
                isLoading: false,
                error: true,
            })
        }
    }, [url])

    useEffect(() => {
        fetchData();
        return () => cancelTokenSource.cancel();
    }, [url, fetchData])

    const {data, isLoading, error} = fetchedData;
    return { data, isLoading, error };

};

export default useFetch;