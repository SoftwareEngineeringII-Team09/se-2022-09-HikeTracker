import { SERVER_URL } from "./config";
import axios from 'axios';

const parkingLots = {
    addParkingLot: (data) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/parkingLots`, data, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error));
        })
    },
}

export default parkingLots