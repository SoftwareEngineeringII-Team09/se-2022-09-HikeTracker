const cities = require('../../data/comuni.json')

const CITIES = cities.map(c => ({ ...c, nome: c.nome.toUpperCase() }))
exports.getCityName = (cityId) => CITIES.find(city => city.comune === cityId).nome