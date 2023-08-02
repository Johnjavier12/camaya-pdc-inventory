import Http from 'utils/Http'
import { useQuery, useMutation } from 'react-query'


const scanAndCheck = () => {

    return useMutation(async formData => {
        return await Http.put('/api/auto-gate/scan-and-check', formData)
    });

}

/**
 * Corregidor
 */

const corregidorPasses = () => {

    return useMutation(async formData => {
        return await Http.post('/api/auto-gate/corregidor-passes', formData)
    });

}

const corregidorGuests = (date) => {

    return useQuery("corregidor-guests", async () => {
        const { data } = await Http.get(`/api/auto-gate/corregidor-guests/${date}`);
        return data;
    }, {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
    });

}

/**
 * 1BITS
 */

const getAvailableTrips = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/get-available-trips', formData)
    });

}

const bookFerryTrip = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/book-ferry-trip', formData)
    });

}

const getTripsByDate = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/get-trips-by-date', formData)
    });

}

const getPassengersByDate = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/get-passengers-by-date', formData)
    });
}

const downloadPassengerManifest = (selectedDate) => {

    return useMutation(async formData => {
        return await Http.post(`/api/one-bits/download-passenger-manifest`, formData, {responseType: 'blob'}).then(({data}) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `OneBITS-Passengers-Manifest-${selectedDate}.xlsx`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    });
}

const boardPassenger = () => {

    return useMutation(async formData => {
        return await Http.put('/api/one-bits/board-passenger', formData)
    });

}

const noShowPassenger = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/no-show-passenger-trip', formData)
    });

}

const cancelTrip = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/cancel-passenger-trip', formData)
    });

}

const bookFerryTripAdmin = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/book-ferry-trip-admin', formData)
    });

}

const confirmTrip = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/confirm-passenger-trip', formData)
    });

}

const getBookings = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/get-bookings', formData)
    });

}

const confirmBooking = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/confirm-booking', formData)
    });

}

const boardPassengerAdmin = () => {

    return useMutation(async formData => {
        return await Http.post('/api/one-bits/board-passenger-trip', formData)
    });

}

const getPassengersByReferenceNumber = () => {

}

const updatePassengerDetails = () => {

}

  

export default {
    getPassengersByReferenceNumber,
    updatePassengerDetails,
    scanAndCheck,
    corregidorPasses,
    corregidorGuests,

    getAvailableTrips,
    bookFerryTrip,
    getTripsByDate,
    getPassengersByDate,
    boardPassenger,

    cancelTrip,
    bookFerryTripAdmin,

    confirmTrip,

    getBookings,
    confirmBooking,

    downloadPassengerManifest,

    boardPassengerAdmin,
    noShowPassenger,
}