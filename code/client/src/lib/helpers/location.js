import * as locations from '@data/locations'

export const __REGIONS = locations.regions.map(r => ({...r, nome: r.nome.toUpperCase()}))
export const __PROVINCES = locations.provinces.map(p => ({...p, nome: p.nome.toUpperCase()}))
export const __CITIES = locations.cities.map(c => ({...c, nome: c.nome.toUpperCase()}))

export const getLocationFullName = (provinceId, cityId) => {
    const provinceName = __PROVINCES.find(province => province.provincia === provinceId).nome
    const cityName = __CITIES.find(city => city.comune === cityId).nome
    return `${cityName}, ${provinceName}`
}

export const getProvincesForRegion = (region) => __PROVINCES.filter(province => province.regione === region)

export const getCitiesForProvince = (province) => __CITIES.filter(city => city.provincia === province)
