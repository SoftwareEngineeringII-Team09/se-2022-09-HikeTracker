import filters from '@data/filters'

const defaultFilters = {
    difficulty: [...filters.difficulty.values],
    length: [...filters.length.values],
    ascent: [...filters.ascent.values],
    roundtrip_time: [...filters.roundtrip_time.values],
    location: {
        province: 0,
        city: 0
    }
}

const filtersKeys = Object.keys(filters)

const getFilterName = (category) => {
    return category.replace(category[0], category[0].toUpperCase()).replace("_", " ")
}

const getFilterValues = (category) => {
    return filters[category].values
}

const getFilterLabel = (category, filter) => {
    if (filters[category].type === "select") return filter
    else return !filter.min ? `Less than ${filter.max}${filters[category].unit}` :
        !filter.max ? `More than ${filter.min}${filters[category].unit}` :
            `Between ${filter.min}${filters[category].unit} and ${filter.max}${filters[category].unit}`
}

const filterHikes = (hikes, filters) => {
    if (filters.active)
        return hikes.filter(hike => {
            // Difficulty filter
            return filters.difficulty.includes(hike.difficulty)
                // Length filter
                && filters.length.some((value) => {
                    if (!value.min) return hike.length <= value.max
                    else if (!value.max) return hike.length >= value.min
                    else return hike.length <= value.max && hike.length >= value.min
                })
                // Ascent filter
                && filters.ascent.some((value) => {
                    if (!value.min) return hike.totalAscent <= value.max
                    else if (!value.max) return hike.totalAscent >= value.min
                    else return hike.totalAscent <= value.max && hike.totalAscent >= value.min
                })
                // Roundtrip time filter
                && filters.roundtrip_time.some((value) => {
                    if (!value.min) return hike.expectedTime.hours < value.max
                    else if (!value.max) return parseInt(hike.expectedTime.hours) >= value.min
                    else return ((parseInt(hike.expectedTime.hours) === value.max && parseInt(hike.expected_time.minutes) <= 0) || parseInt(hike.expectedTime.hours) < value.max)
                        && parseInt(hike.expectedTime.hours) >= value.min
                })
                // Location filter
                && (!filters.location.city || (filters.location.city && filters.location.city === hike.city))
                && (!filters.location.province || (filters.location.province && filters.location.province === hike.province))
        })
    else return hikes
}

const helperFilters = { defaultFilters, filtersKeys, getFilterName, getFilterValues, getFilterLabel, filterHikes }

export default helperFilters