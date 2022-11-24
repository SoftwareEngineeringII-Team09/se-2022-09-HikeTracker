import provinces from '@data/provinces'
import cities from '@data/cities'

export const __PROVINCES = provinces
export const __CITIES = cities

export const getLocationFullName = (provinceId, cityId) => {
    const provinceName = provinces.find(province => province.istat_provincia === provinceId).provincia
    const cityName = cities.find(city => city.codiceistatcomune === cityId).comune
    return `${cityName}, ${provinceName}`
}

export const getCitiesForProvince = (province) => cities.filter(city => city.istat_provincia === province)
