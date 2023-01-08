import axios from 'axios';

import { getCityName } from '@lib/helpers/location'

const URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=";

const geolocalization = {
    checkPointCity: (point, city) => {
        return new Promise((resolve, reject) => {
            axios.get(`${URL}${point.longitude},${point.latitude}`)
                .then(res =>
                    res.data.address.City.toUpperCase() === getCityName(parseInt(city)) ?
                        resolve() :
                        reject("Point and city must be consistent!")
                )
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        })
    }
}

export default geolocalization;