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
                    if (!value.min) return hike.total_ascent <= value.max
                    else if (!value.max) return hike.total_ascent >= value.min
                    else return hike.total_ascent <= value.max && hike.total_ascent >= value.min
                })
                // Roundtrip time filter
                && filters.roundtrip_time.some((value) => {
                    if (!value.min) return hike.expected_time.hours < value.max
                    else if (!value.max) return hike.expected_time.hours >= value.min
                    else return ((hike.expected_time.hours === value.max && hike.expected_time.minutes <= 0) || hike.expected_time.hours < value.max)
                        && hike.expected_time.hours >= value.min
                })
                // Location filter
                && (!filters.location.city || (filters.location.city && filters.location.city === hike.city))
                && (!filters.location.province || (filters.location.province && filters.location.province === hike.province))
        })
    else return hikes
}

const helperFilters = { defaultFilters, filtersKeys, getFilterName, getFilterValues, getFilterLabel, filterHikes }

export default helperFilters