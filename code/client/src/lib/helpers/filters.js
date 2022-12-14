import { isPointWithinRadius } from 'geolib'

export const __DEFAULT_FILTERS = {
    difficulty: { tourist: true, hiker: true, professional: true },
    length: { min: 1, max: 1000 },
    totalAscent: { min: 1, max: 10000 },
    expectedTime: { min: 0.5, max: 24 },
    geoArea: {
        location: {
            region: 0,
            province: 0,
            city: 0
        },
        position: {
            radius: 0,
            point: {
                lat: 0,
                lng: 0
            }
        }
    }
}

export const __DEFAULT_FILTERS_HUTS = {
    altitude: { min: 0, max: 8000 },
    cost: { min: 0, max: 10000 },
    beds: { min: 0, max: 5000 },
    geoArea: {
        location: {
            region: 0,
            province: 0,
            city: 0
        },
        position: {
            radius: 0,
            point: {
                lat: 0,
                lng: 0
            }
        }
    }
}

const getRegion = (filters) => parseInt(filters.geoArea.location.region)
const getLat = (filters) => filters.geoArea.position.point.lat
const getLng = (filters) => filters.geoArea.position.point.lng

export const haveGeoAreaConflict = (filters) => getRegion(filters) && getLat(filters) && getLng(filters)

export const filterHikes = (hikes, filters, active) => {
    const { difficulty, length, totalAscent, expectedTime } = filters
    const { region, province, city } = filters.geoArea.location
    const { radius, point } = filters.geoArea.position

    if (active)
        return hikes.filter(hike => {
            return (
                // Difficulty filter
                difficulty[hike.difficulty.split(' ')[0].toLowerCase()]
                // Length filter
                && (hike.length >= length.min && hike.length <= length.max)
                // Ascent filter
                && (hike.ascent >= totalAscent.min && hike.ascent <= totalAscent.max)
                // Roundtrip time filter
                && ((parseInt(hike.expectedTime.hours) + parseInt(hike.expectedTime.minutes) / 60) >= expectedTime.min
                    && (parseInt(hike.expectedTime.hours) + parseInt(hike.expectedTime.minutes) / 60) <= expectedTime.max)
                // Location filter
                && (!parseInt(city) || (parseInt(city) && parseInt(city) === hike.city))
                && (!parseInt(province) || (parseInt(province) && parseInt(province) === hike.province))
                && (!parseInt(region) || (parseInt(region) && parseInt(region) === hike.region))
                // Position filter
                && ((!point.lat && !point.lng) || (isPointWithinRadius(
                    { latitude: hike.startPoint.coords[0], longitude: hike.startPoint.coords[1] },
                    { latitude: point.lat, longitude: point.lng },
                    radius * 1000
                )))
            )
        })
    else return hikes
}

export const isFilteredHikesArrayEmpty = (hikes, filters, active) => !filterHikes(hikes, filters, active).length

export const filterHuts = (huts, filters, active) => {
    const { altitude, cost, beds } = filters
    const { region, province, city } = filters.geoArea.location
    const { radius, point } = filters.geoArea.position

    if (active)
        return huts.filter(hut => {
            return (
                // Altitude filter
                (hut.altitude >= altitude.min && hut.altitude <= altitude.max)
                // Cost filter
                && (hut.cost >= cost.min && hut.cost <= cost.max)
                // Beds filter
                && (hut.numOfBeds >= beds.min && hut.numOfBeds <= beds.max)
                // Location filter
                && (!parseInt(city) || (parseInt(city) && parseInt(city) === hut.city))
                && (!parseInt(province) || (parseInt(province) && parseInt(province) === hut.province))
                && (!parseInt(region) || (parseInt(region) && parseInt(region) === hut.region))
                // Position filter
                && ((!point.lat && !point.lng) || (isPointWithinRadius(
                    { latitude: hut.latitude, longitude: hut.longitude },
                    { latitude: point.lat, longitude: point.lng },
                    radius * 1000
                )))
            )
        })
    else return huts
}

export const isFilteredHutsArrayEmpty = (huts, filters, active) => !filterHuts(huts, filters, active).length