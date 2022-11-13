import provinces from '@data/provinces'
import cities from '@data/cities'

const getLocationFullName = (provinceId, cityId) => {
    const provinceName = provinces.find(province => province.istat_provincia === provinceId).provincia
    const cityName = cities.find(city => city.codiceistatcomune === cityId).comune
    return `${cityName}, ${provinceName}`
}

const getCitiesForProvince = (province) => cities.filter(city => city.istat_provincia === province)

const helperLocation = { provinces, cities, getLocationFullName, getCitiesForProvince }

export default helperLocation