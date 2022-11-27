import { SERVER_URL } from "./config";
import axios from 'axios';

const parkingLots = {
    addParkingLot: (parkingLotName, point) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/parkingLots`, {
                parkingLotName,
                latitude: point.latitude,
                longitude: point.longitude,
                altitude: point.altitude,
            }, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error));
        })
    },
}

export default parkingLots